<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from '$app/environment';
  import Desktop from "./../lib/components/Desktop.svelte";
  import Dock from "../lib/components/Dock.svelte";
  import Window from "../lib/components/Window.svelte";
  import Launchpad from "../lib/components/Launchpad.svelte";
  import { windows, addWindow, isAppRunning, isAppMinimized } from "../lib/stores/windowStore";

  let isLaunchpadOpen = false;

  onMount(() => {
    if (browser) {
      document.title = "Home | Ansxuman";
      if (window.innerWidth >= 768) {
        addWindow("terminal");
      }
    }
  });

  function handleOpenLaunchpad() {
    isLaunchpadOpen = true;
  }

  function handleLaunchApp(event: CustomEvent<string>) {
    addWindow(event.detail as "terminal" | "safari" | "photos" | "blog" | "projects" | "github");
    isLaunchpadOpen = false;
  }
</script>

<main class="min-h-screen font-mono relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 opacity-80"></div>
  
  <Desktop />
  
  {#each $windows as window (window.id)}
    <Window {window} />
  {/each}
  
  <Dock {isAppRunning} {isAppMinimized} {addWindow} on:openLaunchpad={handleOpenLaunchpad} />
  
  <Launchpad isOpen={isLaunchpadOpen} on:launchApp={handleLaunchApp} on:closeLaunchpad={() => isLaunchpadOpen = false} />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
