<script lang="ts">
  import type { wType } from "../types/wType";
  import { closeWindow, toggleMinimize, toggleMaximize } from "../stores/windowStore";
  import { onMount } from "svelte";
  import { fade, slide } from 'svelte/transition';
  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let windowInstance: wType;

  interface Photo {
    path: string;
    name: string;
    album: string;
    isFavorite: boolean;
  }

  let photos: Photo[] = [];
  let selectedPhoto: Photo | null = null;
  let isGridView = true;
  let sidebarOpen = true;
  let currentView = 'Library';
  let currentAlbum = 'All Photos';

  function toggleFavorite(photo: Photo) {
  photo.isFavorite = !photo.isFavorite;
  photos = [...photos];
  localStorage.setItem('favoritePhotos', JSON.stringify(photos.filter(p => p.isFavorite).map(p => p.name)));
}

  onMount(async () => {
    const photoModules = import.meta.glob('../assets/photos/*.{jpeg,jpg,png,gif}', { eager: true });
    const favoritePhotos = JSON.parse(localStorage.getItem('favoritePhotos') || '[]');
    for (const path in photoModules) {
      const photo = photoModules[path] as { default: string };
      const name = path.split('/').pop() || '';
      const album = Math.random() > 0.5 ? 'Favorites' : 'Recents';
      const isFavorite = favoritePhotos.includes(name);
      photos = [...photos, { path: photo.default, name, album, isFavorite }];
    }
  });

  function selectPhoto(photo: Photo) {
    selectedPhoto = photo;
  }

  function closePreview() {
    selectedPhoto = null;
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function changeView(view: string) {
    currentView = view;
  }

  function toggleGridList() {
    isGridView = !isGridView;
  }

  function changeAlbum(album: string) {
    currentAlbum = album;
  }

  $: filteredPhotos = currentAlbum === 'All Photos' 
    ? photos 
    : currentAlbum === 'Favorites'
      ? photos.filter(photo => photo.isFavorite)
      : photos.filter(photo => photo.album === currentAlbum);

  function openCloud() {
    const url = 'https://www.pexels.com/@ansxuman/';
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }
</script>

<div class="bg-white h-full rounded-lg flex flex-col shadow-lg overflow-hidden font-sans">
  <!-- Photos Header -->
  <div class="bg-gray-100 px-4 py-2 flex items-center border-b border-gray-200" on:mousedown={(e) => windowInstance && startDrag(e, windowInstance.id, "move")}>
    <div class="flex space-x-2">
      <div class="w-3 h-3 rounded-full bg-red-500 cursor-pointer" on:click={() => windowInstance && closeWindow(windowInstance.id)}></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" on:click={() => windowInstance && toggleMinimize(windowInstance.id)}></div>
      <div class="w-3 h-3 rounded-full bg-green-500 cursor-pointer" on:click={() => windowInstance && toggleMaximize(windowInstance.id)}></div>
    </div>
    <div class="flex-grow flex justify-center space-x-4">
      <button class="text-gray-600 hover:text-gray-800 transition-colors {currentView === 'Library' ? 'font-semibold' : ''}" on:click={() => changeView('Library')}>
        <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Library
      </button>
      <button class="text-gray-600 hover:text-gray-800 transition-colors {currentView === 'For You' ? 'font-semibold' : ''}" on:click={() => changeView('For You')}>
        <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        For You
      </button>
      <button class="text-gray-600 hover:text-gray-800 transition-colors {currentView === 'Memories' ? 'font-semibold' : ''}" on:click={() => changeView('Memories')}>
        <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Memories
      </button>
    </div>
    <button on:click={toggleSidebar} class="text-gray-600 hover:text-gray-800 transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
    </button>
    <button on:click={toggleGridList} class="text-gray-600 hover:text-gray-800 transition-colors ml-2">
      {#if isGridView}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
      {:else}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
      {/if}
    </button>
    <button on:click={openCloud} class="text-gray-600 hover:text-gray-800 transition-colors ml-2 flex items-center">
      Pexels <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
    </button>
  </div>

  <!-- Photos Body -->
  <div class="flex-grow flex overflow-hidden">
    {#if sidebarOpen}
      <div class="w-48 bg-gray-50 border-r border-gray-200 p-4" transition:slide>
        <h3 class="font-semibold text-gray-700 mb-2">Albums</h3>
        <ul class="space-y-2">
          {#each ['All Photos', 'Recents', 'Favorites', 'Shared'] as album}
            <li 
              class="text-gray-600 hover:text-gray-800 cursor-pointer p-2 rounded transition-colors duration-200 {currentAlbum === album ? 'bg-blue-100 text-blue-600' : ''}"
              on:click={() => changeAlbum(album)}
            >
              {album}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    <div class="flex-grow overflow-auto p-6">
      {#if currentView === 'Library'}
        {#if selectedPhoto}
          <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" on:click={closePreview} transition:fade>
            <img src={selectedPhoto.path} alt={selectedPhoto.name} class="max-w-full max-h-full object-contain" />
          </div>
        {/if}
        <div class={isGridView ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-4"}>
          {#each filteredPhotos as photo}
          <div class="group relative overflow-hidden rounded-lg shadow-md cursor-pointer" on:click={() => selectPhoto(photo)}>
            <img src={photo.path} alt={photo.name} class={isGridView ? "w-full h-40 object-cover" : "w-full h-20 object-cover"} />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
            <button 
            class="absolute bottom-2 right-2 text-white hover:text-red-500 transition-colors duration-200"
            on:click|stopPropagation={() => toggleFavorite(photo)}
          >
            <svg class="w-6 h-6" fill={photo.isFavorite ? "red" : "none"} stroke={photo.isFavorite ? "red" : "white"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
              {#if !isGridView}
                <div class="absolute inset-0 flex items-center p-2 bg-black bg-opacity-50 text-white">
                  <span class="text-sm">{photo.name}</span>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else if currentView === 'For You'}
        <div class="text-center text-gray-600">
          <h2 class="text-2xl font-semibold mb-4">For You</h2>
          <p>Personalized photo suggestions will appear here.</p>
          
        </div>
      {:else if currentView === 'Memories'}
        <div class="text-center text-gray-600">
          <h2 class="text-2xl font-semibold mb-4">Memories</h2>
          <p>Your photo memories will be displayed here.</p>
        </div>
      {/if}
    </div>
  </div>
</div>