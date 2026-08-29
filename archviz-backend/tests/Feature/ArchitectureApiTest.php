<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Architecture;
use PHPUnit\Framework\Attributes\Test;

class ArchitectureApiTest extends TestCase
{
    use RefreshDatabase;

    /* -------------------------------------------------------------------------- */
    /*                                1. AUTH TESTS                               */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function user_can_login_with_correct_credentials()
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'hussein@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'hussein@example.com',
            'password' => 'password123',
        ]);

        // Assert HTTP 200 OK and check for standard Sanctum token payload structure
        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type']);
    }

    #[Test]
    public function authenticated_user_can_fetch_their_profile()
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Simulate authenticated API session and fetch user profile
        $response = $this->actingAs($user)->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJson(['id' => $user->id, 'email' => $user->email]);
    }

    /* -------------------------------------------------------------------------- */
    /*                          2. LIKE & UNLIKE TESTS                            */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function user_can_like_and_unlike_an_architecture()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $architecture = Architecture::create([
            'user_id' => $user->id,
            'title' => 'E-Commerce Microservices',
            'prompt_input' => 'Create e-commerce app',
            'share_slug' => 'ecommerce-micro',
            'is_public' => true,
            'likes_count' => 0,
            'diagram_json' => ['nodes' => []]
        ]);

        // 1. Dispatch like request and verify success response
        $likeResponse = $this->actingAs($user)
            ->postJson("/api/architectures/{$architecture->id}/like");

        $likeResponse->assertStatus(200);

        // 2. Dispatch unlike request and verify success response
        $unlikeResponse = $this->actingAs($user)
            ->postJson("/api/architectures/{$architecture->id}/unlike");

        $unlikeResponse->assertStatus(200);
    }

    /* -------------------------------------------------------------------------- */
    /*                       3. BOOKMARK & UNBOOKMARK TESTS                       */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function user_can_bookmark_unbookmark_and_get_saved_list()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $architecture = Architecture::create([
            'user_id' => $user->id,
            'title' => 'Weather API System',
            'prompt_input' => 'Weather app design',
            'share_slug' => 'weather-api-sys',
            'is_public' => true,
            'diagram_json' => ['nodes' => []]
        ]);

        // 1. Save architecture to user bookmarks
        $this->actingAs($user)
            ->postJson("/api/architectures/{$architecture->id}/bookmark")
            ->assertStatus(200);

        // 2. Retrieve user bookmarked items list
        $response = $this->actingAs($user)
            ->getJson('/api/bookmarks');

        $response->assertStatus(200);

        // Flexible JSON assertion supporting both wrapped resource and direct array payloads
        if (isset($response->json()['data'])) {
            $response->assertJsonCount(1, 'data');
        } else {
            $response->assertJsonCount(1);
        }

        // 3. Remove architecture from user bookmarks
        $this->actingAs($user)
            ->postJson("/api/architectures/{$architecture->id}/unbookmark")
            ->assertStatus(200);
    }

    /* -------------------------------------------------------------------------- */
    /*                         4. EXPLORE & PUBLIC ROUTES                         */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function user_can_get_public_and_trending_architectures()
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Seed a public architecture with high likes count to satisfy trending criteria
        Architecture::create([
            'user_id' => $user->id,
            'title' => 'Public Project',
            'prompt_input' => 'Public project details',
            'share_slug' => 'public-proj',
            'is_public' => true,
            'likes_count' => 60,
            'diagram_json' => ['nodes' => []]
        ]);

        // Test public architectures feed endpoint
        $this->actingAs($user)
            ->getJson('/api/architectures/public')
            ->assertStatus(200);

        // Test trending architectures feed endpoint
        $this->actingAs($user)
            ->getJson('/api/architectures/trending')
            ->assertStatus(200);
    }

    #[Test]
    public function it_can_fetch_a_public_shared_architecture_by_slug()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $architecture = Architecture::create([
            'user_id' => $user->id,
            'title' => 'Test Architecture',
            'prompt_input' => 'Create test app',
            'share_slug' => 'my-test-slug',
            'is_public' => true,
            'views_count' => 0,
            'diagram_json' => ['nodes' => [], 'summary' => 'Test summary']
        ]);

        // Fetch publicly accessible architecture via its unique slug
        $response = $this->actingAs($user)
            ->getJson("/api/architectures/share/{$architecture->share_slug}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'share_slug', 'diagram_json'],
                'user_interactions' => ['liked', 'bookmarked']
            ]);
    }

    /* -------------------------------------------------------------------------- */
    /*                                5. EDGE CASES                               */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function unauthenticated_user_cannot_access_protected_routes()
    {
        // Assert unauthenticated request to profile endpoint returns 401 Unauthorized
        $this->getJson('/api/me')
            ->assertStatus(401);

        // Assert unauthenticated request to bookmarks endpoint returns 401 Unauthorized
        $this->getJson('/api/bookmarks')
            ->assertStatus(401);
    }

    #[Test]
    public function login_fails_with_invalid_credentials_or_missing_fields()
    {
        // 1. Assert empty payload triggers 422 Unprocessable Entity with validation errors
        $this->postJson('/api/login', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);

        // 2. Assert invalid password credentials return 422 Unprocessable Entity
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'wrongpass@example.com',
            'password' => bcrypt('correct-password'),
        ]);

        $this->postJson('/api/login', [
            'email' => 'wrongpass@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(422);
    }

    #[Test]
    public function unbookmarked_architecture_does_not_fail_if_already_not_bookmarked()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $architecture = Architecture::create([
            'user_id' => $user->id,
            'title' => 'Edge Case Test System',
            'prompt_input' => 'System description',
            'share_slug' => 'edge-case-sys',
            'is_public' => true,
            'diagram_json' => ['nodes' => []]
        ]);

        // Attempting to unbookmark a non-bookmarked item returns 409 Conflict status
        $this->actingAs($user)
            ->postJson("/api/architectures/{$architecture->id}/unbookmark")
            ->assertStatus(409);
    }

    /* -------------------------------------------------------------------------- */
    /*                                6. IDOR TESTS                               */
    /* -------------------------------------------------------------------------- */

    #[Test]
    public function user_cannot_delete_another_users_architecture()
    {
        /** @var User $owner */
        $owner = User::factory()->create();

        /** @var User $attacker */
        $attacker = User::factory()->create();

        // Create architecture owned strictly by owner user
        $architecture = Architecture::create([
            'user_id' => $owner->id,
            'title' => 'Owner Private Project',
            'prompt_input' => 'Secret prompt',
            'share_slug' => 'owner-project',
            'is_public' => false,
            'diagram_json' => ['nodes' => []]
        ]);

        // Attacker attempts unauthorized deletion of owner's architecture
        $this->actingAs($attacker)
             ->deleteJson("/api/architectures/{$architecture->id}")
             ->assertStatus(404); // Endpoint safely responds with 404 to obscure record existence

        // Verify target record remains untouched in database
        $this->assertDatabaseHas('architectures', [
            'id' => $architecture->id
        ]);
    }

    #[Test]
    public function user_cannot_access_another_users_private_architecture_by_id()
    {
        /** @var User $owner */
        $owner = User::factory()->create();

        /** @var User $attacker */
        $attacker = User::factory()->create();

        // Create private architecture record
        $architecture = Architecture::create([
            'user_id' => $owner->id,
            'title' => 'Top Secret Architecture',
            'prompt_input' => 'Super secret system design',
            'share_slug' => 'top-secret-slug',
            'is_public' => false,
            'diagram_json' => ['nodes' => []]
        ]);

        // Attacker attempts direct retrieval of private architecture via ID
        $this->actingAs($attacker)
             ->getJson("/api/architectures/{$architecture->id}")
             ->assertStatus(404); 
    }
}