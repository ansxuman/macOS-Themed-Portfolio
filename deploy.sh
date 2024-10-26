#!/bin/bash

# Pull the latest changes from the repository
git pull

# Build the project
npm run build

# Restart the pm2 server
pm2 restart macOS-Portfolio --watch