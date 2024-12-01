<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import photos from '$lib/assets/icons/photos.avif'; 
  import terminal from '$lib/assets/icons/terminal.avif';
  import safari from '$lib/assets/icons/safari.png';
  import projects from '$lib/assets/icons/projects.png';
  import blog from '$lib/assets/icons/blog.png';
  import github from '$lib/assets/icons/github.png';
  import clave from '$lib/assets/icons/clave.png';
  
  export let isOpen: boolean;
  const dispatch = createEventDispatcher();

  let searchText = '';
  let searchFocused = false;

  const apps = [
    { id: 'photos', name: 'Photos', icon: photos },
    { id: 'terminal', name: 'Terminal', icon: terminal },
    { id: 'safari', name: 'Safari', icon: safari },
    { id: 'projects', name: 'Projects', icon: projects },
    { id: 'blog', name: 'Blog', icon: blog },
    { id: 'github', name: 'Github', icon: github },
    {id: 'clave', name:'Clave', icon: clave}
  ];

  $: filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchText.toLowerCase())
  );

  function launchApp(appId: string) {
  dispatch('launchApp', appId);
  dispatch('closeLaunchpad');
}

</script>

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xl font-sf"
    transition:fade={{ duration: 200 }}
    on:click={() => dispatch('closeLaunchpad')}
  >
    <div class="w-full h-full flex flex-col items-center pt-8">
      <div 
        class="w-64 h-8 bg-white/10 rounded-md flex items-center px-3 mb-8 transition-all duration-300 focus-within:bg-white/20 focus-within:ring-1 focus-within:ring-white/30"
        on:click|stopPropagation
      >
        <div class="flex items-center justify-center w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 text-white/50 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            bind:value={searchText}
            class="w-full bg-transparent text-white placeholder-white/50 outline-none font-light text-sm"
          />
        </div>
      </div>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-x-8 gap-y-12 p-8 max-w-7xl mx-auto">
        {#if filteredApps.length > 0}
          {#each filteredApps as app}
            <div 
              class="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-110"
              on:click|stopPropagation={() => launchApp(app.id)}
              in:scale={{duration: 200, delay: 100}}
              out:scale={{duration: 200}}
            >
              <img src={app.icon} alt={app.name} class="w-20 h-20 mb-2 object-contain" />
              <span class="text-white text-sm text-center font-light">{app.name}</span>
            </div>
          {/each}
        {:else}
          <div class="col-span-full text-center text-white/70 font-light text-xl">
            No Results
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}


<style>
  .font-sf {
    font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', sans-serif;
  }
</style>