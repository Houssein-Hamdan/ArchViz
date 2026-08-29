<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SendOtpMail;
use App\Models\OtpVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OtpController extends Controller
{
    /**
     * Step 1: Generate and dispatch OTP code to the requested email address
     * POST /api/auth/send-otp
     */
    public function sendOtp(Request $request)
    {
        // Validate input payload for email format
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $email = $request->input('email');

        // Prevent OTP dispatch if the email is already registered in system
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email already registered. Please login instead.'
            ], 422);
        }

        try {
            // Generate a secure 6-digit zero-padded OTP code
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            // Purge existing unverified OTP records for the target email
            OtpVerification::where('email', $email)->delete();

            // Persist the fresh OTP instance with a 15-minute expiration window
            OtpVerification::create([
                'email' => $email,
                'otp' => $otp,
                'attempts' => 0,
                'expires_at' => now()->addMinutes(15),
            ]);

            // Dispatch OTP email notification
            Mail::to($email)->send(new SendOtpMail($otp, $email));

            return response()->json([
                'status' => 'success',
                'message' => 'OTP sent to your email',
                'email' => $email,
                'expires_in' => 900, // Expiration duration in seconds (15 min)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Step 2: Validate the user-provided OTP code and issue a stateless temporary token
     * POST /api/auth/verify-otp
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $email = $request->input('email');
        $otp = $request->input('otp');

        $otpRecord = OtpVerification::where('email', $email)->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP not found. Request a new one.'
            ], 404);
        }

        if ($otpRecord->isVerified()) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP already used.'
            ], 422);
        }

        if (!$otpRecord->isValid()) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP expired. Request a new one.'
            ], 422);
        }

        // Handle invalid OTP attempt limit checks
        if ($otpRecord->otp !== $otp) {
            $otpRecord->increment('attempts');

            if ($otpRecord->attempts >= 5) {
                $otpRecord->delete();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Too many failed attempts. Request a new OTP.'
                ], 429);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP. Please try again.',
                'attempts_remaining' => 5 - $otpRecord->attempts
            ], 422);
        }

        // Generate a random temporary token for sessionless multi-step registration
        $tempToken = Str::random(60);

        $otpRecord->update([
            'verified_at' => now(),
            'temp_token'  => $tempToken,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'OTP verified successfully',
            'email' => $email,
            'temp_token' => $tempToken,
        ]);
    }

    /**
     * Step 3: Complete registration process using the database-verified temporary token
     * POST /api/auth/complete-registration
     */
    public function completeRegistration(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'temp_token' => 'required|string',
        ]);

        $email = $request->input('email');
        $tempToken = $request->input('temp_token');

        // Verify the temporary token directly against the database record
        $otpRecord = OtpVerification::where('email', $email)
            ->where('temp_token', $tempToken)
            ->first();

        if (!$otpRecord || !$otpRecord->isVerified()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired session. Please verify OTP again.'
            ], 422);
        }

        if (User::where('email', $email)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email already registered.'
            ], 422);
        }

        try {
            // Create user account
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $email,
                'password' => bcrypt($request->input('password')),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            // Permanently delete the OTP verification record after successful registration
            $otpRecord->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Registration completed successfully',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resend a fresh OTP token if the current email is not yet verified
     * POST /api/auth/resend-otp
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');

        // Check if an existing verified OTP record exists
        $otpRecord = OtpVerification::where('email', $email)->first();

        if ($otpRecord && $otpRecord->isVerified()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email already verified.'
            ], 422);
        }

        // Delegate execution back to sendOtp
        return $this->sendOtp(new Request(['email' => $email]));
    }
}