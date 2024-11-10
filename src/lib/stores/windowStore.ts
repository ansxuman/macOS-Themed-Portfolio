import { writable, get } from 'svelte/store';
import type { wType } from '../types/wType';

export const windows = writable<wType[]>([]);
let nextZIndex = 1;

export function addWindow(type: "terminal" | "safari" | "photos" | "blog" | "projects" | "github") {

  if (type === "github") {
    window.open('https://github.com/ansxuman', '_blank');
    return;
  }

  const currentWindows = get(windows);
  const existingWindow = currentWindows.find((w) => w.type === type);
  if (existingWindow) {
    focusWindow(existingWindow.id);
    if (existingWindow.minimized) {
      toggleMinimize(existingWindow.id);
    }
    return;
  }

  const windowWidth = 900;
  const windowHeight = 600;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const newWindow: wType = {
    id: `${type}-${Date.now()}`,
    type,
    minimized: false,
    maximized: false,
    position: {
      x: (screenWidth - windowWidth) / 2,
      y: (screenHeight - windowHeight) / 2,
    },
    size: { width: windowWidth, height: windowHeight },
    zIndex: nextZIndex++,
  };
  windows.update(w => [...w, newWindow]);
}

export function focusWindow(id: string) {
  windows.update(currentWindows => {
    return currentWindows
      .map((w) => ({
        ...w,
        zIndex: w.id === id ? nextZIndex++ : w.zIndex,
      }))
      .sort((a, b) => a.zIndex - b.zIndex);
  });
}

export function closeWindow(id: string) {
  windows.update(currentWindows => currentWindows.filter((w) => w.id !== id));
}

export function toggleMinimize(id: string) {
  windows.update(currentWindows => 
    currentWindows.map((w) =>
      w.id === id ? { ...w, minimized: !w.minimized } : w
    )
  );
}

export function toggleMaximize(id: string) {
  windows.update(currentWindows => 
    currentWindows.map((w) => {
      if (w.id === id) {
        if (!w.maximized) {
          return {
            ...w,
            maximized: true,
            position: { x: 0, y: 0 },
            size: { width: window.innerWidth, height: window.innerHeight },
          };
        } else {
          return {
            ...w,
            maximized: false,
            position: {
              x: (window.innerWidth - 600) / 2,
              y: (window.innerHeight - 400) / 2,
            },
            size: { width: 600, height: 400 },
          };
        }
      }
      return w;
    })
  );
}

export function isAppRunning(type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects'): boolean {
  const currentWindows = get(windows);
  return currentWindows.some(w => w.type === type && !w.minimized);
}

export function isAppMinimized(type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects'): boolean {
  const currentWindows = get(windows);
  return currentWindows.some(w => w.type === type && w.minimized);
}