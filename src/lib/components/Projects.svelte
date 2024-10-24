<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProjectData } from '../types/projectType';
  import { projects } from '../stores/projectStore';
  import { closeWindow, toggleMinimize, toggleMaximize } from "../stores/windowStore";
  import type { wType } from "../types/wType";
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlockWrapper from './CodeBlockWrapper.svelte';
  import ProjectIcons from './ProjectIcons.svelte';
  import { getTagColor, getTypeColor } from '../utils/tagColors';
  import 'github-markdown-css/github-markdown-light.css';

  export let startDrag: (e: MouseEvent, id: string, action: 'move' | 'resize') => void;
  export let window: wType;

  let selectedProject: ProjectData | null = null;
  let readmeContent: string = '';
  let isLoading: boolean = false;

  onMount(() => {
    if ($projects.length > 0) {
      selectProject($projects[0]);
    }
  });

  async function selectProject(project: ProjectData) {
    selectedProject = project;
    isLoading = true;
    try {
      const response = await fetch(project.readmeUrl);
      readmeContent = await response.text();
    } catch (error) {
      console.error('Failed to fetch README:', error);
      readmeContent = 'Failed to load README content.';
    } finally {
      isLoading = false;
    }
  }

  function openProjectLink(url: string) {
    if (typeof globalThis !== 'undefined') {
      globalThis.window.open(url, '_blank');
    }
  }

  const renderers = {
    code: CodeBlockWrapper
  };

</script>

<div class="bg-white h-full rounded-lg flex flex-col overflow-hidden font-sans">
  <!-- Projects Header -->
  <div class="bg-gray-100 px-2 py-2 flex items-center cursor-move border-b border-gray-200" on:mousedown={(e) => startDrag(e, window.id, "move")}>
    <div class="flex space-x-2 mr-4">
      <button class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none" on:click={() => closeWindow(window.id)}>
        <svg class="w-3 h-3 text-red-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none" on:click={() => toggleMinimize(window.id)}>
        <svg class="w-3 h-3 text-yellow-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M20 12H4" />
        </svg>
      </button>
      <button class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none" on:click={() => toggleMaximize(window.id)}>
        <svg class="w-3 h-3 text-green-800 opacity-0 hover:opacity-100" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
        </svg>
      </button>
    </div>
    <div class="flex-grow text-center font-semibold">Projects</div>
  </div>

  <div class="flex-grow flex overflow-hidden">
    <div class="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50">
      {#each $projects as project,index}
        <div 
          class="p-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 {selectedProject === project ? 'bg-blue-100 border-l-2 border-blue-500' : ''}"
          on:click={() => selectProject(project)}
        >
          <div class="flex items-center mb-2">
            <div class="w-6 h-6 mr-2 text-gray-600">
              <ProjectIcons iconName={project.icon} />
            </div>
            <h3 class="font-semibold flex-grow text-gray-800 truncate">{project.name}</h3>
            <button 
              class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              on:click|stopPropagation={() => openProjectLink(project.githubUrl)}
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">{project.shortDescription}</p>
          <div class="flex flex-wrap gap-1 mt-2">
            <span class="px-2 py-1 text-xs font-medium rounded-full capitalize {getTypeColor(project.type)}">
              {project.type}
            </span>
            {#each project.technologies as tech}
              <span class="px-2 py-1 text-xs font-medium rounded-full {getTagColor(tech)}">
                {tech}
              </span>
            {/each}
          </div>
        </div>
        {#if index < $projects.length - 1}
          <hr class="border-gray-300" />
        {/if}
      {/each}
    </div>

    <div class="flex-1 overflow-hidden flex flex-col bg-white">
      {#if selectedProject}
        <div class="overflow-y-auto flex-grow">
          {#if isLoading}
            <div class="flex justify-center items-center h-64">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          {:else}
            <div class="markdown-body prose prose-sm max-w-none">
              <SvelteMarkdown source={readmeContent} {renderers} />
            </div>
          {/if}
        </div>
      {:else}
        <div class="p-6 flex items-center justify-center h-full">
          <p class="text-gray-600 text-center">Select a project to view details</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.markdown-body) {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }

  @media (max-width: 767px) {
    :global(.markdown-body) {
      padding: 15px;
    }
  }
</style>
