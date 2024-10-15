<script lang="ts">
  import type { wType } from "../types/wType";
  import { closeWindow, toggleMinimize, toggleMaximize } from "../stores/windowStore";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';
  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let window: wType;

  let terminalLines: string[] = [];
  let currentInput = "";
  let terminalRef: HTMLDivElement;
  let showPrompt = false;
  let commandHistory: string[] = [];
  let historyIndex = -1;

  function addLine(text: string) {
    terminalLines = [...terminalLines, text];
    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (terminalRef) {
        terminalRef.scrollTop = terminalRef.scrollHeight;
      }
    }, 0);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentInput = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        historyIndex--;
        currentInput = historyIndex === -1 ? '' : commandHistory[historyIndex];
      }
    }
  }

  function processCommand(cmd: string) {
    addLine(
      `<span class="text-green-400">ansxuman@macbook</span><span class="text-white">:</span><span class="text-blue-400">~</span><span class="text-white">$</span> ${cmd}`
    );

    commandHistory = [cmd, ...commandHistory];
    historyIndex = -1;

    switch (cmd.toLowerCase()) {
      case "help":
        addLine("Available commands:");
        addLine("about    - Learn more about me");
        addLine("skills   - View my technical skills");
        addLine("projects - See my recent projects");
        addLine("contact  - Get in touch");
        addLine("clear    - Clear the terminal");
        addLine("date     - Display current date and time");
        addLine("echo     - Print a message");
        addLine("ls       - List directory contents");
        break;
      case "about":
        addLine(
          "I am a passionate software developer with expertise in Go and web technologies."
        );
        addLine("I love building efficient and scalable applications.");
        break;
      case "skills":
        addLine("• Go");
        addLine("• JavaScript/TypeScript");
        addLine("• SvelteKit");
        addLine("• React");
        addLine("• Node.js");
        addLine("• Docker");
        addLine("• PostgreSQL");
        break;
      case "projects":
        addLine("Recent Projects:");
        addLine("1. RESTful API in Go");
        addLine("2. Real-time chat application");
        addLine("3. E-commerce platform");
        addLine("4. This portfolio website");
        break;
      case "contact":
        addLine("📧 Email: your.email@example.com");
        addLine("🐙 GitHub: github.com/yourusername");
        addLine("💼 LinkedIn: linkedin.com/in/yourusername");
        break;
      case "clear":
        terminalLines = [];
        break;
      case "date":
        addLine(new Date().toLocaleString());
        break;
      case "ls":
        addLine("Documents");
        addLine("Projects");
        addLine("Downloads");
        addLine("Desktop");
        break;
      default:
        if (cmd.toLowerCase().startsWith("echo ")) {
          addLine(cmd.slice(5));
        } else {
          addLine(
            `Command not found: ${cmd}. Type "help" for available commands.`
          );
        }
    }
  }

  onMount(() => {
    showPrompt = true;
    addLine("Welcome to ansxuman's Portfolio Terminal");
    addLine('Type "help" to see available commands');
  });
</script>

<div class="bg-gray-900/40 backdrop-blur-md h-full border border-white/20">
  <!-- Terminal Header -->
  <div class="bg-gray-800/80 px-4 py-2 flex items-center cursor-move" on:mousedown={(e) => startDrag(e, window.id, "move")}>
    <div class="flex space-x-2">
      <div class="w-3 h-3 rounded-full bg-red-500 cursor-pointer" on:click={() => closeWindow(window.id)}></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" on:click={() => toggleMinimize(window.id)}></div>
      <div class="w-3 h-3 rounded-full bg-green-500 cursor-pointer" on:click={() => toggleMaximize(window.id)}></div>
    </div>
    <div class="flex-grow text-center text-sm text-gray-400">
      ansxuman@macbook: ~
    </div>
  </div>

  <!-- Terminal Body -->
  <div bind:this={terminalRef} class="bg-black/30 p-4 overflow-y-auto" style="height: calc(100% - 80px);">
    {#each terminalLines as line}
      <p class="mb-1 text-gray-200" transition:fade|local={{ duration: 150 }}>{@html line}</p>
    {/each}
  </div>

  <!-- Terminal Input -->
  {#if showPrompt}
    <div class="bg-black/30 px-4 py-2 flex items-center">
      <span class="text-green-400 mr-1">ansxuman@macbook</span>
      <span class="text-white mr-1">:</span>
      <span class="text-blue-400 mr-1">~</span>
      <span class="text-white mr-2">$</span>
      <input
        type="text"
        bind:value={currentInput}
        on:keydown={(e) => {
          if (e.key === "Enter" && currentInput.trim()) {
            processCommand(currentInput.trim());
            currentInput = "";
          } else {
            handleKeydown(e);
          }
        }}
        class="bg-transparent border-none outline-none flex-grow text-gray-200 w-full"
        autocomplete="off"
        autofocus
      />
    </div>
  {/if}
</div>