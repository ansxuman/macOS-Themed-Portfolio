<script lang="ts">
  import TopBar from "./TopBar.svelte";
  import MusicPlayer from "./MusicPlayer.svelte";
  import { onMount } from "svelte";

  let currentTime = new Date();

  onMount(() => {
    const timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });
</script>

<div class="h-screen w-screen bg-[#2D3748] overflow-hidden font-sf">
  <TopBar />
  <div class="p-4 flex flex-col items-start">
    <!-- Clock Widget -->
    <div
      class="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white w-full max-w-md mb-4 shadow-lg"
    >
      <div class="flex flex-col items-center">
        <div class="text-6xl font-light mb-2">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
        <div class="text-lg font-medium">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>

    <!-- Music Player Widget -->
    <MusicPlayer />
  </div>
</div>

<style>
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .bg-gradient-to-r {
    background-size: 200% 200%;
    animation: gradient 5s ease infinite;
  }

  .font-sf {
    font-family: -apple-system, BlinkMacSystemFont, "San Francisco",
      "Helvetica Neue", sans-serif;
  }
</style>
