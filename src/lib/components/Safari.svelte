<script lang="ts">
  import type { wType } from "../types/wType";
  import { closeWindow, toggleMinimize, toggleMaximize } from "../stores/windowStore";
  import { onMount } from "svelte";
  
  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let window: wType;

  let url = "";
  let iframeUrl = "";
  let isLoading = false;
  let canGoBack = false;
  let canGoForward = false;
  let iframeElement: HTMLIFrameElement;
  let showHomepage = true;

  function handleSubmit() {
    if (url) {
      navigateTo(url);
    }
  }

  function navigateTo(newUrl: string) {
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    isLoading = true;
    iframeUrl = newUrl;
    url = newUrl;
    showHomepage = false;
  }

  function openEndlessHorse(url: string) {
    if (typeof globalThis !== 'undefined') {
        globalThis.window.open(url, '_blank');
      }
  }

  function goBack() {
    if (canGoBack) {
      isLoading = true;
      iframeElement.contentWindow?.history.back();
    }
  }

  function goForward() {
    if (canGoForward) {
      isLoading = true;
      iframeElement.contentWindow?.history.forward();
    }
  }

  function refresh() {
    isLoading = true;
    iframeElement.src = iframeElement.src;
  }

  function goHome() {
    iframeUrl = "";
    url = "";
    isLoading = false;
    showHomepage = true;
  }

  onMount(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'navigate') {
      navigateTo(event.data.url);
    }
  };

  globalThis.addEventListener('message', handleMessage);

  return () => {
    globalThis.removeEventListener('message', handleMessage);
  };
});

</script>

<div class="bg-white h-full rounded-lg flex flex-col overflow-hidde font-sf">
  <!-- Safari Header -->
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
    <div class="flex-grow flex items-center space-x-2">
      <button class="text-gray-600 hover:text-gray-800 disabled:opacity-50" on:click={goBack} disabled={!canGoBack}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button class="text-gray-600 hover:text-gray-800 disabled:opacity-50" on:click={goForward} disabled={!canGoForward}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button class="text-gray-600 hover:text-gray-800" on:click={refresh}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <button class="text-gray-600 hover:text-gray-800" on:click={goHome}>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
      <form on:submit|preventDefault={handleSubmit} class="flex-grow">
        <input 
          type="text" 
          bind:value={url} 
          class="w-full px-3 py-1 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="Enter URL"
        />
      </form>
    </div>
  </div>

  <!-- Safari Body -->
  <div class="flex-grow relative">
    {#if showHomepage}
    <div class="min-h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <div class="text-center text-white">
        <h1 class="text-4xl font-bold mb-4">Welcome to Safari</h1>
        <p class="text-xl mb-4">Explore the web with ease</p>
        <p class="text-sm mb-8">Note: Some websites may not load due to security restrictions</p>
        <div class="flex space-x-4 justify-center">
          <button on:click={() => openEndlessHorse('http://endless.horse/')} class="bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-blue-100 transition duration-200 flex items-center justify-center">
            <span class="mr-2 text-sm">Endless Horse</span>
            <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 256 256" xml:space="preserve" class="w-5 h-5">
              <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                <path d="M 30 15 C 13.431 15 0 28.431 0 45 s 13.431 30 30 30 s 30 -13.431 30 -30 S 46.569 15 30 15 z M 30 54 c -4.971 0 -9 -4.029 -9 -9 s 4.029 -9 9 -9 s 9 4.029 9 9 c 0.007 4.964 -4.012 8.993 -8.976 9 C 30.016 54 30.008 54 30 54 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,174,239); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                <path d="M 63.72 37.5 c 7.622 2.194 16.62 0 16.62 0 c -2.611 11.4 -10.891 18.54 -22.831 19.409 C 52.777 67.893 41.96 75.007 30 75 l 9 -28.606 C 48.252 16.992 52.994 15 74.935 15 H 90 C 87.48 26.1 78.794 34.579 63.72 37.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,140,207); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
              </g>
            </svg> -->
            <!-- <span class="ml-2 text-sm"></span> -->
          </button>
          <button on:click={() => navigateTo('https://www.wikipedia.org')} class="bg-white text-purple-500 px-6 py-2 rounded-full hover:bg-purple-100 transition duration-200">
            Wikipedia
          </button>
        </div>
      </div>
    </div>
    {:else}
      {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center bg-white">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      {/if}
      <iframe 
      bind:this={iframeElement}
      src={iframeUrl}
      title="browser-frame" 
      class="w-full h-full border-none"
      on:load={() => {
        isLoading = false;
        try {
          canGoBack = iframeElement.contentWindow?.history.length > 1;
          canGoForward = false;
          url = iframeElement.contentWindow?.location.href || url;
        } catch (error) {
          console.log('Unable to access iframe content due to security restrictions');
          canGoBack = false;
          canGoForward = false;
        }
      }}
      sandbox="allow-scripts allow-same-origin allow-forms"
    ></iframe>
    {/if}
  </div>
</div>

<style>
  .font-sf {
    font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', sans-serif;
  }
</style>