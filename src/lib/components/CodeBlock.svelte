<script lang="ts">
    import { onMount } from 'svelte';
    import Prism from 'prismjs';
    import 'prismjs/themes/prism.css';
    import 'prismjs/components/prism-go';

    export let node: { lang?: string; text?: string } = {};

    let language = node.lang || '';
    let code = node.text || '';
    let highlighted: string;
    let showToast = false;

    onMount(() => {
      if (language && Prism.languages[language]) {
        highlighted = Prism.highlight(code, Prism.languages[language], language);
      } else {
        highlighted = code;
      }
    });

    function copyCode() {
      navigator.clipboard.writeText(code).then(() => {
        showToast = true;
        setTimeout(() => {
          showToast = false;
        }, 2000);
      });
    }
</script>

<div class="relative mb-4">
    <pre><code class={`language-${language}`}>{@html highlighted}</code></pre>
    <button 
      class="absolute top-2 right-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded p-1 transition-colors duration-300 flex items-center justify-center"
      on:click={copyCode}
    >
      {#if showToast}
        <span class="text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded">Copied!</span>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      {/if}
    </button>
</div>
