<script lang="ts">
    import { onMount } from 'svelte';
    import type { BlogPost } from '../types/blogType';
    import { blogPosts, fetchBlogPosts } from '../stores/blogStore';
    import { closeWindow, toggleMinimize, toggleMaximize } from "../stores/windowStore";
    import type { wType } from "../types/wType";
    import SvelteMarkdown from 'svelte-markdown';
    import 'github-markdown-css/github-markdown-light.css';
  
    export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
    export let window: wType;
  
    let selectedPost: BlogPost | null = null;
    let isLoading: boolean = true;
  
    onMount(async () => {
      isLoading = true;
      await fetchBlogPosts();
      isLoading = false;
    });
  
    function selectPost(post: BlogPost) {
      selectedPost = post;
    }
  
    function openPostLink(url: string) {
      if (typeof globalThis !== 'undefined') {
        globalThis.window.open(url, '_blank');
      }
    }
  
    function getRandomColor() {
      const colors = ['bg-red-200 text-red-800', 'bg-blue-200 text-blue-800', 'bg-green-200 text-green-800', 
                      'bg-yellow-200 text-yellow-800', 'bg-purple-200 text-purple-800', 'bg-pink-200 text-pink-800'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
</script>
  
<div class="bg-white h-full rounded-lg flex flex-col overflow-hidden font-sans">
  <!-- Blog Header -->
  <div class="bg-gray-100 px-2 py-2 flex items-center cursor-move border-b border-gray-200" on:mousedown={(e) => startDrag(e, window.id, "move")}>
    <div class="flex space-x-2 mr-4">
      <button class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none" on:click={() => closeWindow(window.id)}>
        <svg class="w-3 h-3 text-red-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none" on:click={() => toggleMinimize(window.id)}>
        <svg class="w-3 h-3 text-yellow-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M20 12H4" />
        </svg>
      </button>
      <button class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none" on:click={() => toggleMaximize(window.id)}>
        <svg class="w-3 h-3 text-green-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
        </svg>
      </button>
    </div>
    <div class="flex-grow text-center font-semibold">Blog Posts</div>
    <div class="flex space-x-2">
      <a href="https://medium.com/@ansxuman" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      </a>
      <a href="https://dev.to/ansxuman" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
        </svg>
      </a>
      <a href="https://hashnode.com/@ansxuman" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z"/>
        </svg>
      </a>
    </div>
  </div>
  
  <div class="flex-grow flex overflow-hidden">
    <div class="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50">
      {#if isLoading}
        <div class="flex justify-center items-center h-full">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      {:else}
        {#each $blogPosts as post, index}
          <div 
            class="p-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 {selectedPost === post ? 'bg-blue-100 border-l-2 border-blue-500' : ''}"
            on:click={() => selectPost(post)}
          >
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-gray-800 truncate">{post.title}</h3>
              <button 
                class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                on:click|stopPropagation={() => openPostLink(post.url)}
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.reading_time_minutes}m
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.page_views_count.toLocaleString()}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              {#each post.tag_list as tag}
                <span class="px-2 py-1 text-xs font-medium rounded-full {getRandomColor()}">{tag}</span>
              {/each}
            </div>
          </div>
          {#if index < $blogPosts.length - 1}
            <hr class="border-gray-300" />
          {/if}
        {/each}
      {/if}
    </div>
  
    <div class="flex-1 overflow-hidden flex flex-col bg-white">
      {#if selectedPost}
        <div class="overflow-y-auto flex-grow p-6">
          <h1 class="text-2xl font-bold mb-4">{selectedPost.title}</h1>
          {#if selectedPost.cover_image}
            <img src={selectedPost.cover_image} alt={selectedPost.title} class="w-full h-48 object-cover mb-4 rounded-lg" />
          {/if}
          <div class="markdown-body prose prose-sm max-w-none">
            <SvelteMarkdown source={selectedPost.body_markdown} />
          </div>
        </div>
      {:else}
        <div class="p-6 flex items-center justify-center h-full">
          <p class="text-gray-600 text-center">Select a blog post to view details</p>
        </div>
      {/if}
    </div>
  </div>
</div>
  
<style>
  :global(.markdown-body) {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }
  
  @media (max-width: 767px) {
    :global(.markdown-body) {
      padding: 15px;
    }
  }
</style>
