import { useState } from 'react';
import toast from 'react-hot-toast';
import { Wand2, Loader, AlertCircle } from 'lucide-react';
import { architectureService } from '../../services/architectureService';

export default function PromptForm({ onArchitectureGenerated }) {
  const [formData, setFormData] = useState({
    prompt_input: '',
    tech_stack: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'prompt_input') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.prompt_input.trim()) {
      toast.error('Please describe your architecture');
      return;
    }

    if (formData.prompt_input.length < 15) {
      toast.error('Description must be at least 15 characters');
      return;
    }

    if (formData.prompt_input.length > 500) {
      toast.error('Description must be less than 500 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await architectureService.generateArchitecture(
        formData.prompt_input.trim(),
        formData.tech_stack.trim() || null
      );

      if (response.status === 'success') {
        toast.success('Architecture generated!');
        onArchitectureGenerated({
          prompt_input: formData.prompt_input,
          tech_stack: formData.tech_stack,
          diagram_json: response.data,
        });
      } else {
        toast.error(response.message || 'Failed to generate architecture');
      }
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Failed to generate architecture';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Describe Your Architecture
        </h2>
        <p className="text-gray-600">
          Tell us about your project idea and let AI generate a complete architecture diagram
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Project Description
            </label>
            <span className={`text-sm ${
              charCount > 500 ? 'text-red-600' : 
              charCount > 450 ? 'text-yellow-600' : 
              'text-gray-500'
            }`}>
              {charCount}/500
            </span>
          </div>
          
          <textarea
            name="prompt_input"
            value={formData.prompt_input}
            onChange={handleChange}
            placeholder="e.g., Build an e-commerce platform with products, shopping cart, checkout, user authentication, and payment processing"
            maxLength={500}
            rows={6}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans"
          />
          
          <p className="text-xs text-gray-500 mt-2">
            Be specific about features and requirements for better results
          </p>
        </div>

        {/* Tech Stack (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preferred Tech Stack (Optional)
          </label>
          
          <input
            type="text"
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, PostgreSQL, Redis"
            maxLength={255}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <p className="text-xs text-gray-500 mt-2">
            AI will suggest alternatives if you leave this empty
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>AI analyzes your requirements</li>
              <li>Generates nodes (Frontend, Backend, Database, etc.)</li>
              <li>Shows data flow and relationships</li>
              <li>Explains design decisions</li>
            </ul>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.prompt_input.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating Architecture...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Architecture</span>
            </>
          )}
        </button>

        {isLoading && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              ⏳ This might take 15-30 seconds. Please wait...
            </p>
            <div className="mt-2 h-1 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}