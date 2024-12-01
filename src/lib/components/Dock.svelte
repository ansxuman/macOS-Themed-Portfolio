<script lang="ts">
  import { createEventDispatcher,onMount } from 'svelte';
  import { windows } from '../stores/windowStore';

  export let isAppRunning: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects') => boolean;
  export let isAppMinimized: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects') => boolean;
  export let addWindow: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects') => void;

  import launchpad from '$lib/assets/icons/launchpad.png';
  import terminal from '$lib/assets/icons/terminal.avif';
  import safari from '$lib/assets/icons/safari.png';
  import photos from '$lib/assets/icons/photos.avif';
  import blog from '$lib/assets/icons/blog.png';
  import projects from '$lib/assets/icons/projects.png';
  import github from '$lib/assets/icons/github.png';
  import clave from '$lib/assets/icons/clave.png';

  const dispatch = createEventDispatcher();
  let showPopup = false;
  let windowWidth = 0;

  onMount(() => {
    windowWidth = window.innerWidth;

    const handleResize = () => {
      windowWidth = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function handleDockClick(appType: string) {
    if (!isLargeScreen && appType !== 'github' && appType !== 'clave') {
      showPopup = true;
    } else {
      if (appType === 'launchpad') {
        dispatch('openLaunchpad');
      } else if (appType === 'github') {
        window.open('https://github.com/ansxuman', '_blank');
      } else if (appType === 'clave') {
        window.open('https://clave.rocks', '_blank');
      } else {
        addWindow(appType as 'terminal' | 'safari' | 'photos' | 'blog' | 'projects');
      }
    }
  }

  function closePopup() {
    showPopup = false;
  }

  $: terminalWindow = $windows.find(w => w.type === 'terminal');
  $: safariWindow = $windows.find(w => w.type === 'safari');
  $: photosWindow = $windows.find(w => w.type === 'photos');
  $: blogWindow = $windows.find(w => w.type === 'blog');
  $: projectsWindow = $windows.find(w => w.type === 'projects');
  $: isLargeScreen = windowWidth >= 1024;

</script>

<div class="dock fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex space-x-4 items-end">
  <div class="dock-item" on:click={() => handleDockClick('launchpad')}>
    <img src={launchpad} alt="Launchpad" class="h-12 w-12" />
  </div>
  
  <div class="dock-item" on:click={() => handleDockClick("terminal")}>
    <img src={terminal} alt="Terminal" class="h-12 w-12" />
    {#if terminalWindow}
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
    {/if}
  </div>
  
  {#if isLargeScreen}
    <div class="dock-item" on:click={() => handleDockClick("safari")}>
      <img src={safari} alt="safari" class="h-12 w-12" />
      {#if safariWindow}
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
      {/if}
    </div>
  {/if}

  <div class="dock-item" on:click={() => handleDockClick("photos")}>
    <img src={photos} alt="Photos" class="h-12 w-12" />
    {#if photosWindow}
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
    {/if}
  </div>

  {#if isLargeScreen}
  <div class="dock-item" on:click={() => handleDockClick("blog")}>
    <img src={blog} alt="Blog" class="h-12 w-12" />
    {#if blogWindow}
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
    {/if}
    </div>
  {/if}

  <div class="dock-item" on:click={() => handleDockClick("projects")}>
    <img src={projects} alt="Projects" class="h-12 w-12" />
    {#if projectsWindow}
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
    {/if}
  </div>

  <div class="dock-item" on:click={() => handleDockClick("github")}>
    <img src={github} alt="Github" class="h-12 w-12" />
  </div>

  <div class="dock-item" on:click={() => handleDockClick("clave")}>
    <img src={clave} alt="Clave" class="h-12 w-12" />
  </div>
</div>


{#if showPopup}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm mx-auto">
      <h2 class="text-lg font-semibold mb-4">Limited Features</h2>
      <p class="mb-4">For full feature access, please use a desktop device.</p>
      <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={closePopup}>Close</button>
    </div>
  </div>
{/if}

<style>
  .dock {
    height: 68px;
  }

  .dock-item {
    @apply w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer relative;
    transition: all 0.2s ease;
  }

  .dock:hover .dock-item {
    transform: translateY(0px) scale(1);
  }

  .dock .dock-item:hover {
    transform: translateY(-10px) scale(1.2);
  }

  .dock:hover .dock-item:hover + .dock-item {
    transform: translateY(-5px) scale(1.1);
  }

  .dock:hover .dock-item:hover + .dock-item + .dock-item {
    transform: translateY(-2px) scale(1.05);
  }
</style>
