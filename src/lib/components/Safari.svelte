<script lang="ts">
    import type { wType } from "../types/wType";
    import { closeWindow, toggleMinimize, toggleMaximize } from "../stores/windowStore";
    export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
    export let window: wType;
  </script>
  
  <div class="bg-white h-full rounded-lg">
    <!-- Safari Header -->
    <div class="bg-gray-200 px-4 py-2 flex items-center cursor-move" on:mousedown={(e) => startDrag(e, window.id, "move")}>
      <div class="flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-red-500 cursor-pointer" on:click={() => closeWindow(window.id)}></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" on:click={() => toggleMinimize(window.id)}></div>
        <div class="w-3 h-3 rounded-full bg-green-500 cursor-pointer" on:click={() => toggleMaximize(window.id)}></div>
      </div>
      <div class="flex-grow text-center text-sm text-gray-600">
        https://ansxuman.com
      </div>
    </div>
  
    <!-- Safari Body -->
    <div class="h-[calc(100%-2.5rem)] overflow-hidden">
      <iframe src="https://ansxuman.com" class="w-full h-full border-none"></iframe>
    </div>
  </div>