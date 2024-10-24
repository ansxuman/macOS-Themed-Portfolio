<script lang="ts">
  import TopBar from './TopBar.svelte';
  import {  tweened } from 'svelte/motion';
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  
  let currentTime = new Date();
  let isPlaying = false;
  let audio: HTMLAudioElement;
  let progress = tweened(0, {
    duration: 200,
    easing: cubicOut
  });
  let duration = 0;
  
  onMount(() => {
    const timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);
  
    audio = new Audio('https://www.pagalworld.com.so/uploads/files/sfd33/16267/Something%20Just%20Like%20This(PagalWorld.com.so).mp3');
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
    });
  
    return () => {
      clearInterval(timer);
      audio.removeEventListener('timeupdate', updateProgress);
    };
  });
  
  function updateProgress() {
    const newProgress = (audio.currentTime / audio.duration) * 100;
    progress.set(newProgress);
  }
  
  function setProgress(e: MouseEvent) {
    const progressBar = e.currentTarget as HTMLDivElement;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    audio.currentTime = clickPosition * audio.duration;
  }
  
  function togglePlay() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    isPlaying = !audio.paused;
  }
  
  </script>
  
  <div class="h-screen w-screen bg-[#2D3748] overflow-hidden font-sf">
    <TopBar />
    <div class="p-4 flex flex-col items-start">
      
      <!-- Clock Widget -->

      <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white w-full max-w-md mb-4 shadow-lg">
        <div class="flex flex-col items-center">
          <div class="text-6xl font-light mb-2">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
          <div class="text-lg font-medium">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
  
      <!-- Music Player Widget -->
       
      <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Now Playing</h2>
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-24 h-24 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
            <img src="https://www.pagalworld.com.so/uploads/thumb/sft33/16267_4.jpg" alt="Album Art" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-lg truncate">Something Just Like This</p>
            <p class="text-sm text-gray-300 truncate">The Chainsmokers & Coldplay</p>
          </div>
        </div>
        <div class="mb-4">
          <div class="bg-white/20 rounded-full h-2 cursor-pointer overflow-hidden" on:click={setProgress}>
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out" style="width: {$progress}%"></div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <button class="focus:outline-none transform transition hover:scale-110">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          <button class="focus:outline-none transform transition hover:scale-110" on:click={togglePlay}>
            <svg class="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              {#if isPlaying}
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              {:else}
                <path d="M8 5v14l11-7z"/>
              {/if}
            </svg>
          </button>
          <button class="focus:outline-none transform transition hover:scale-110">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
      </div>
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
      font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', sans-serif;
    }
  </style>