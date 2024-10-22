<script lang="ts">
    import { onMount } from 'svelte';
    import Prism from 'prismjs';
    import 'prismjs/themes/prism.css';
    import 'prismjs/components/prism-go';
    // Import other language components as needed

    export let node: { lang?: string; text?: string } = {};

    let language = node.lang || '';
    let code = node.text || '';
    let highlighted: string;

    onMount(() => {
      if (language && Prism.languages[language]) {
        highlighted = Prism.highlight(code, Prism.languages[language], language);
      } else {
        highlighted = code;
      }
    });

    function copyCode() {
      navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
      });
    }
</script>

<div class="code-block relative">
    <pre><code class={`language-${language}`}>{@html highlighted}</code></pre>
    <button class="copy-button" on:click={copyCode}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
</div>

<style>
    .code-block {
        margin-bottom: 1rem;
        position: relative;
    }
    .copy-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 4px;
        padding: 0.25rem;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    .copy-button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    .copy-button svg {
        width: 1rem;
        height: 1rem;
    }
</style>
