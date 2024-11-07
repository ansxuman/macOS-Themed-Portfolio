# macOS-Themed Portfolio

A unique, interactive portfolio website inspired by the macOS interface : https://ssh-i.in || https://macosportfolio.netlify.app

Powered by [SvelteKit](https://kit.svelte.dev/), [TailwindCSS](https://tailwindcss.com/) and [TypeScript](https://www.typescriptlang.org/).

<img width="1439" alt="Screenshot 2024-11-08 at 1 37 12 AM" src="https://github.com/user-attachments/assets/9239bb20-6a1e-4ca2-8896-39dc8d082dbd">


## Project Overview

This project is a personal portfolio website that mimics the look and feel of macOS. It features:

## Core Features
- A desktop-like interface with Status Bar, Widgets and Dock
- Launchpad for an app-like experience
- Draggable and resizable windows
- Minimizable, maximizable and closable windows

## Desktop Widgets
- Music Player
  - Copyright Free playlist with play controls
  - Genre selection and volume control
- Clock Widget
  - Live date and time display

## Applications
- Terminal
  - Interactive command-line interface
  - Supports basic Linux commands
- Blog Viewer
  - Connected to Dev.to
  - Read articles directly in the window
- Project Showcase
  - Live GitHub repository integration
- Photo Gallery
  - Personal photography collection
- Safari Browser
  - Browse websites within the portfolio

## Getting Started

Clone the repo:
   ```bash
   git clone https://github.com/ansxuman/macOS-Themed-Portfolio/
   ```

Install dependencies:
   ```bash
   npm install
   ```
Run the development server:
   ```bash
   npm run dev
   ```
Open http://localhost:1111 in your browser to see the result.

Build for production:
   ```bash
   npm run build
   ```

To make the dev.to article work,update API Key in the .env file
   ```bash
   DEV_TO_API_KEY=<YOUR_API_KEY>
   ```

