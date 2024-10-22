<script lang="ts">
    import CodeBlock from './CodeBlock.svelte';
  
    export let lang: string = '';
    export let text: string = '';
  </script>
  
  <CodeBlock node={{ lang, text }} />