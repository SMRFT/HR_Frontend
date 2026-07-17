# Shanmuga HR - Electron Desktop App Build Guide

This document explains how to run, build, and package the Shanmuga HR application as a Desktop App using Electron.

## Prerequisites

Make sure you have installed:
- Node.js & npm
- All project dependencies (`npm install`)

## Available Scripts

The following scripts are defined in `package.json` for Electron:

### 1. Development Mode
To run the React app in the background and open the Electron desktop app simultaneously:
```bash
npm run electron:dev
```
*Note: This will wait for the React server to start on `http://localhost:3000` before launching the Electron window.*

### 2. Build & Package (Auto Detect OS)
To build the React app and package it for your current operating system:
```bash
npm run electron:build
```

### 3. Build for Mac OS
To explicitly build and generate a Mac installer (`.dmg`):
```bash
npm run package:mac
```
*Outputs will be located in the `dist` folder.*

### 4. Build for Windows
To explicitly build and generate a Windows installer (`.exe`):
```bash
npm run package:win
```
*Outputs will be located in the `dist` folder.*

### 5. Build for All Platforms
To build for both Mac and Windows simultaneously:
```bash
npm run package:all
```

## Build Configuration
The Electron build configuration is defined in `electron-builder.yml`. 
- **App ID:** `com.shanmuga.hr`
- **Output Directory:** `dist/`
- **Mac Icon:** `public/logo512.png`
- **Permissions:** The Mac build includes permissions for the Camera and Microphone, which are required for the Face Recognition & Attendance Marking features.

## Important Note
For face recognition to work properly in the packaged app on macOS, you must ensure that camera permissions are granted when the app prompts for them. The `NSCameraUsageDescription` is already included in the build configuration.

## Publishing Updates (Auto-Updater)
This app is configured to use `electron-updater` via GitHub releases. To publish a new update that users will automatically receive:

1. **Update Version**: Increment the `version` number in `package.json` (e.g., from `"0.1.0"` to `"0.1.1"`).
2. **GitHub Personal Access Token (PAT)**: You need a GitHub token with `repo` scope. Set it as an environment variable in your terminal:
   - **Mac/Linux:** `export GH_TOKEN="your_token_here"`
   - **Windows:** `set GH_TOKEN="your_token_here"`
3. **Build and Publish**: Run the electron-builder command with the publish flag:
   ```bash
   npm run package:all -- -p always
   ```
4. **Draft Release**: This will automatically create a draft release on your GitHub repository and upload the `.exe`, `.dmg`, `.zip`, and `.yml` blockmap files.
5. **Publish**: Go to your GitHub repository's Releases page, edit the drafted release, and publish it. When users next open the app, it will download the update and prompt them to restart.
