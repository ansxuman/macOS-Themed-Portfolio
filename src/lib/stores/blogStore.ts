import { writable } from 'svelte/store';
import type { BlogPost } from '../types/blogType';

export const blogPosts = writable<BlogPost[]>([]);

export async function fetchBlogPosts() {
  try {
    const response = await fetch('/api/blog-posts');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    blogPosts.set(posts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }
}