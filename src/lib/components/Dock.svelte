<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { windows } from '../stores/windowStore';
  export let isAppRunning: (type: 'terminal' | 'safari' | 'photos') => boolean;
  export let isAppMinimized: (type: 'terminal' | 'safari' | 'photos') => boolean;
  export let addWindow: (type: 'terminal' | 'safari' | 'photos') => void;
  import launchpad from './../assets/img/launchpad.png';
  import terminal from './../assets/img/terminal.avif';
  import code from './../assets/img/code.png';
  import photos from './../assets/img/photos.avif';

  const dispatch = createEventDispatcher();

  function openLaunchpad() {
    dispatch('openLaunchpad');
  }

  $: terminalWindow = $windows.find(w => w.type === 'terminal');
  $: safariWindow = $windows.find(w => w.type === 'safari');
  $: photosWindow = $windows.find(w => w.type === 'photos');
</script>

<div class="dock absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex space-x-4 items-end">
  <div class="dock-item" on:click={openLaunchpad}>
    <img src={launchpad} alt="Launchpad" class="h-12 w-12" />
  </div>

  <div class="dock-item bg-blue-500"></div>
  <div class="dock-item bg-green-500"></div>
  <div class="dock-item bg-yellow-500"></div>
  
  <div class="dock-item" on:click={() => addWindow("terminal")}>
    <img src={terminal} alt="Terminal" class="h-12 w-12" />
    {#if terminalWindow}
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
    {/if}
  </div>
  
  {#if safariWindow}
    <div class="dock-item" on:click={() => addWindow("safari")}>
      <img src={code} alt="Code" class="h-12 w-12" />
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
  {/if}

  {#if photosWindow}
  <div class="dock-item" on:click={() => addWindow("photos")}>
    <img src={photos} alt="Photos" class="h-12 w-12" />
    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
  </div>
{/if}

</div>

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
