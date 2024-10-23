import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DEV_TO_API_KEY } from '$env/static/private';



export const GET: RequestHandler = async () => {
  try {
    const response = await fetch('https://dev.to/api/articles/me/published', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': DEV_TO_API_KEY,
        'Accept': 'application/vnd.forem.api-v1+json',
        'User-Agent': 'macOS-Themed-Portfolio',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    return json(posts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
};

