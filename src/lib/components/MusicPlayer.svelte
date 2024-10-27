<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import type { Song, RepeatMode } from "../types/music";
  import {
    ALL_MUSIC,
    INITIAL_VOLUME,
    PROGRESS_UPDATE_DURATION,
  } from "../utils/musicPlaylists";

  let musicIndex = 0;
  let isPlaying = false;
  let audio: HTMLAudioElement;
  let progress = tweened(0, {
    duration: PROGRESS_UPDATE_DURATION,
    easing: cubicOut,
  });
  let currentTime = "0:00";
  let duration = "0:00";
  let volume = INITIAL_VOLUME;
  let isMuted = false;
  let isPlaylistVisible = false;
  let repeatMode: RepeatMode = "shuffle";
  let selectedGenre = 'All';
  $: genres = ['All', ...new Set(ALL_MUSIC.map(song => song.genre))];
  $: filteredPlaylist = selectedGenre === 'All' 
    ? ALL_MUSIC 
    : ALL_MUSIC.filter(song => song.genre === selectedGenre);
  $: currentSong = ALL_MUSIC[musicIndex];

  function getImagePath(imageName: string): string {
    return new URL(`../assets/images/${imageName}`, import.meta.url).href;
  }

  onMount(() => {
    loadMusic(musicIndex);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setTotalDuration);
    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setTotalDuration);
      audio.removeEventListener("ended", handleSongEnd);
    };
  });

  function loadMusic(index: number) {
    musicIndex = index;
    audio.src = new URL(`../assets/mp3s/${ALL_MUSIC[index].src}`, import.meta.url).href;
    audio.load();
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: ALL_MUSIC[index].name,
        artist: ALL_MUSIC[index].artist,
        artwork: [
          {
            src: getImagePath(ALL_MUSIC[index].img),
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audio.play();
        isPlaying = true;
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
        isPlaying = false;
      });
      navigator.mediaSession.setActionHandler('previoustrack', prevSong);
      navigator.mediaSession.setActionHandler('nexttrack', nextSong);
    }
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    isPlaying = !isPlaying;
  }

  function updateProgress() {
    const newProgress = (audio.currentTime / audio.duration) * 100;
    progress.set(newProgress);
    currentTime = formatTime(audio.currentTime);
  }

  function setTotalDuration() {
    duration = formatTime(audio.duration);
  }

  function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function setProgress(e: MouseEvent) {
    const progressBar = e.currentTarget as HTMLDivElement;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    audio.currentTime = clickPosition * audio.duration;
  }

  function prevSong() {
    let newIndex = (musicIndex - 1 + ALL_MUSIC.length) % ALL_MUSIC.length;
    while (!filteredPlaylist.includes(ALL_MUSIC[newIndex])) {
      newIndex = (newIndex - 1 + ALL_MUSIC.length) % ALL_MUSIC.length;
    }
    musicIndex = newIndex;
    loadMusic(musicIndex);
    if (isPlaying) audio.play();
  }

  function nextSong() {
    let newIndex = (musicIndex + 1) % ALL_MUSIC.length;
    while (!filteredPlaylist.includes(ALL_MUSIC[newIndex])) {
      newIndex = (newIndex + 1) % ALL_MUSIC.length;
    }
    musicIndex = newIndex;
    loadMusic(musicIndex);
    if (isPlaying) audio.play();
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    isMuted = audio.muted;
    if (isMuted) {
      volume = 0;
    } else {
      volume = audio.volume * 100;
    }
  }

  function changeVolume() {
    audio.volume = volume / 100;
    isMuted = volume === 0;
  }

  function togglePlaylist() {
    isPlaylistVisible = !isPlaylistVisible;
  }

  function selectSong(index: number) {
    musicIndex = getGlobalIndex(index);
    loadMusic(musicIndex);
    if (isPlaying) audio.play();
    isPlaylistVisible = false;
  }

  function toggleRepeatMode() {
    switch (repeatMode) {
      case "repeat":
        repeatMode = "repeat_one";
        break;
      case "repeat_one":
        repeatMode = "shuffle";
        break;
      case "shuffle":
        repeatMode = "repeat";
        break;
    }
  }

  function handleSongEnd() {
    switch (repeatMode) {
      case "repeat":
        nextSong();
        break;
      case "repeat_one":
        audio.currentTime = 0;
        audio.play();
        break;
      case "shuffle":
        let randIndex;
        do {
          randIndex = Math.floor(Math.random() * ALL_MUSIC.length);
        } while (randIndex === musicIndex);
        musicIndex = randIndex;
        loadMusic(musicIndex);
        audio.play();
        break;
    }
  }

  function changeGenre(genre: string) {
    selectedGenre = genre;
    const newFilteredPlaylist = selectedGenre === 'All' 
      ? ALL_MUSIC 
      : ALL_MUSIC.filter(song => song.genre === selectedGenre);
    
    if (!newFilteredPlaylist.includes(ALL_MUSIC[musicIndex])) {
      musicIndex = ALL_MUSIC.findIndex(song => newFilteredPlaylist.includes(song));
      loadMusic(musicIndex);
      if (isPlaying) audio.play();
    } else {
      musicIndex = ALL_MUSIC.findIndex(song => song === currentSong);
    }
    
    filteredPlaylist = newFilteredPlaylist;
  }

  function getGlobalIndex(filteredIndex: number): number {
    return ALL_MUSIC.findIndex(song => song === filteredPlaylist[filteredIndex]);
  }
</script>

<div
  class="bg-white/10 backdrop-blur-md rounded-xl p-6 pb-8 text-white w-full max-w-md"
>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Now Playing</h2>
    <div class="flex items-center space-x-2">
      <div class="relative">
        <select 
          bind:value={selectedGenre} 
          on:change={() => changeGenre(selectedGenre)}
          class="appearance-none bg-white/10 border border-white/20 text-white py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white/20 focus:border-white"
        >
          {#each genres as genre}
            <option value={genre}>{genre}</option>
          {/each}
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      <button class="focus:outline-none" on:click={togglePlaylist}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  </div>

  <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
    <div class="w-24 h-24 bg-gray-600 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
      <img
        src={getImagePath(currentSong.img)}
        alt="Album Art"
        class="w-full h-full object-cover"
        class:rotate={isPlaying}
      />
    </div>
    <div class="flex-1 min-w-0 text-center md:text-left">
      <p class="font-bold text-lg truncate">{currentSong.name}</p>
      <p class="text-sm text-gray-300 truncate">{currentSong.artist}</p>
      <span class="inline-block bg-blue-500 text-xs font-semibold px-2 py-1 rounded-full mt-1">{currentSong.genre}</span>
    </div>
  </div>

  <div class="mb-4">
    <div
      class="bg-white/20 rounded-full h-2 cursor-pointer overflow-hidden"
      on:click={setProgress}
    >
      <div
        class="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
        style="width: {$progress}%"
      ></div>
    </div>
    <div class="flex justify-between text-sm mt-1">
      <span>{currentTime}</span>
      <span>{duration}</span>
    </div>
  </div>

  <div class="flex justify-between items-center mb-4">
    <button
      class="focus:outline-none transform transition hover:scale-110"
      on:click={toggleRepeatMode}
    >
      {#if repeatMode === "repeat"}
        <svg
          width="24px"
          height="24px"
          viewBox="-0.5 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 19.4199H8C6.4087 19.4199 4.88254 18.7878 3.75732 17.6626C2.63211 16.5374 2 15.0112 2 13.4199V11.6699"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 22.4199L22 19.4199L19 16.4199"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 5.41992H16C17.5913 5.41992 19.1174 6.05203 20.2426 7.17725C21.3678 8.30246 22 9.82862 22 11.4199V13.22"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 2.41992L2 5.41992L5 8.41992"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {:else if repeatMode === "repeat_one"}
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
        >
          <path
            d="M17 17H8C6.33333 17 3 16 3 12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 7H16C17.6667 7 21 8 21 12C21 13.4943 20.5348 14.57 19.865 15.3312"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.5 14.5L17 17L14.5 19.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 8V5V3L2 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {:else}
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
        >
          <path
            d="M18 15L21 18M21 18L18 21M21 18H18.5689C17.6297 18 17.1601 18 16.7338 17.8705C16.3564 17.7559 16.0054 17.5681 15.7007 17.3176C15.3565 17.0348 15.096 16.644 14.575 15.8626L14.3333 15.5M18 3L21 6M21 6L18 9M21 6H18.5689C17.6297 6 17.1601 6 16.7338 6.12945C16.3564 6.24406 16.0054 6.43194 15.7007 6.68236C15.3565 6.96523 15.096 7.35597 14.575 8.13744L9.42496 15.8626C8.90398 16.644 8.64349 17.0348 8.29933 17.3176C7.99464 17.5681 7.64357 17.7559 7.2662 17.8705C6.83994 18 6.37033 18 5.43112 18H3M3 6H5.43112C6.37033 6 6.83994 6 7.2662 6.12945C7.64357 6.24406 7.99464 6.43194 8.29933 6.68236C8.64349 6.96523 8.90398 7.35597 9.42496 8.13744L9.66667 8.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {/if}
    </button>
    <button
      class="focus:outline-none transform transition hover:scale-110"
      on:click={prevSong}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        />
      </svg>
    </button>
    <button
      class="focus:outline-none transform transition hover:scale-110 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center"
      on:click={togglePlay}
    >
      {#if isPlaying}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      {/if}
    </button>
    <button
      class="focus:outline-none transform transition hover:scale-110"
      on:click={nextSong}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    </button>
    <button
      class="focus:outline-none transform transition hover:scale-110"
      on:click={toggleMute}
    >
      {#if isMuted}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clip-rule="evenodd"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      {/if}
    </button>
  </div>

  <div class="flex items-center mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
    </svg>
    <input
      type="range"
      min="0"
      max="100"
      bind:value={volume}
      on:input={changeVolume}
      class="w-full"
    />
    <span class="ml-2 text-sm">{volume}</span>
  </div>

  {#if isPlaying}
    <div class="flex justify-center items-center h-12 mb-4">
      {#each Array(5) as _, i}
        <span
          class="w-2 mx-1 h-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-full wave"
          style="animation-delay: {i * 0.2}s"
        ></span>
      {/each}
    </div>
  {/if}

  {#if isPlaylistVisible}
    <div class="mt-4 bg-white/5 rounded-lg p-4 max-h-60 overflow-y-auto custom-scrollbar">
      <h3 class="text-lg font-semibold mb-2">Playlist</h3>
      <ul class="px-2">
        {#each filteredPlaylist as song, index}
          <li class="py-2 px-3 cursor-pointer hover:bg-white/10 rounded" on:click={() => selectSong(index)}>
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">{song.name}</p>
                <p class="text-sm text-gray-300">{song.artist}</p>
              </div>
              {#if song === currentSong}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<audio bind:this={audio}></audio>

<style>
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }

  .rotate {
    animation: rotation 7s infinite linear;
  }

  @keyframes wave {
    0%,
    100% {
      transform: scaleY(0.5);
    }
    50% {
      transform: scaleY(1);
    }
  }

  .wave {
    animation: wave 1.5s ease-in-out infinite;
    transform-origin: bottom;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>

