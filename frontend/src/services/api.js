const API_BASE_URL = 'http://localhost:4000/api';

export const generateShader = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-shader`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate shader');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating shader:', error);
    throw error;
  }
};