import client from './client';

export const architectureService = {
  // Generate architecture (Gemini)
  generateArchitecture: async (prompt_input, tech_stack) => {
    const response = await client.post('/architectures/generate', {
      prompt_input,
      tech_stack,
    });
    return response.data;
  },

  // Save architecture
  saveArchitecture: async (title, prompt_input, tech_stack, diagram_json, tradeoffs_json) => {
    const response = await client.post('/architectures', {
      title,
      prompt_input,
      tech_stack,
      diagram_json,
      tradeoffs_json,
    });
    return response.data;
  },
  // Delete architecture
  deleteArchitecture: async (architectureId) => { 
    const response = await client.delete( `/architectures/${architectureId}` ); 
    return response.data; },

  // Get user's architectures
  getUserArchitectures: async () => {
    const response = await client.get('/architectures');
    return response.data;
  },

  // Get shared architecture
  getSharedArchitecture: async (slug) => {
    const response = await client.get(`/architectures/share/${slug}`);
    return response.data;
  },
  // Get all public architectures
  getPublicArchitectures: async () => {
    const response = await client.get('/architectures/public');
    return response.data;
  },

  // Search public architectures
  searchPublicArchitectures: async (query) => {
    const response = await client.get('/architectures/public', {
      params: { search: query }
    });
    return response.data;
  },

  // Like architecture
  likeArchitecture: async (architectureId) => {
    const response = await client.post(`/architectures/${architectureId}/like`);
    return response.data;
  },

  // Unlike architecture
  unlikeArchitecture: async (architectureId) => {
    const response = await client.post(`/architectures/${architectureId}/unlike`);
    return response.data;
  },

  // Add bookmark
  addBookmark: async (architectureId) => {
    const response = await client.post(`/architectures/${architectureId}/bookmark`);
    return response.data;
  },

  // Remove bookmark
  removeBookmark: async (architectureId) => {
    const response = await client.post(`/architectures/${architectureId}/unbookmark`);
    return response.data;
  },

  // Get user's bookmarks
  getUserBookmarks: async () => {
    const response = await client.get('/bookmarks');
    return response.data;
  },

  // Get trending architectures
  getTrendingArchitectures: async () => {
    const response = await client.get('/architectures/trending');
    return response.data;
  },
};