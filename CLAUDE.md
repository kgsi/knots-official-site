# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based website project called "knots-official-site". It uses Astro v5.12.8 as the main framework for building static sites with modern web technologies.

## Development Commands

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview built site locally
- `npm run astro` - Run Astro CLI commands

## Code Formatting

The project uses Prettier for code formatting with these plugins:
- `prettier-plugin-astro` - Format Astro components
- `prettier-plugin-organize-imports` - Auto-organize imports

Run Prettier formatting as needed when making changes.

## Project Architecture

### Directory Structure
- `src/pages/` - Astro pages (file-based routing)
- `src/layouts/` - Reusable layout components
- `src/components/` - Astro components
- `src/assets/` - Static assets like images and SVGs
- `public/` - Static files served directly

### Key Files
- `astro.config.mjs` - Astro configuration (currently minimal)
- `tsconfig.json` - TypeScript config extending Astro's strict preset
- Package uses ES modules (`"type": "module"`)

### Component Structure
The project follows standard Astro patterns:
- `Layout.astro` provides base HTML structure
- `Welcome.astro` is the main landing component
- Pages use `.astro` extension and support TypeScript

## TypeScript Configuration

Uses Astro's strict TypeScript configuration with all TypeScript files included and dist folder excluded.