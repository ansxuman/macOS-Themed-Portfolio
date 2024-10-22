import { writable } from 'svelte/store';
import type { ProjectData } from '../types/projectType';
import ProjectIcons from '../components/ProjectIcons.svelte';

const initialProjects: ProjectData[] = [
  {
    id: 'go-touchid',
    name: 'Go TouchID',
    icon: 'go',
    shortDescription: 'A simple Go Library for Touch ID authentication on darwin.',
    githubUrl: 'https://github.com/ansxuman/go-touchid',
    readmeUrl: 'https://raw.githubusercontent.com/ansxuman/go-touchid/main/README.md',
    technologies: ['Go', 'macOS', 'TouchID'],
    type: 'library'
  },
  {
    id: 'go-version-compare',
    name: 'Go Version Compare',
    icon: 'go',
    shortDescription: 'Go Library for Version Comparison',
    githubUrl: 'https://github.com/ansxuman/versioncompare',
    readmeUrl: 'https://raw.githubusercontent.com/ansxuman/versioncompare/main/README.md',
    technologies: ['Go'],
    type: 'library'
  },
];

export const projects = writable<ProjectData[]>(initialProjects);