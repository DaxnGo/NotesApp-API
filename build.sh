#!/bin/bash

# Install dependencies
npm ci

# Build the application
npm run build

# Create a symbolic link from dist to public 
# (as an alternative approach if the vercel.json doesn't work)
ln -sf dist public 