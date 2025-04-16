# React + Vite on GitHub Pages

This project is a React application built with Vite and configured for deployment to GitHub Pages.

## Features

- React 18 with Hooks
- Vite as build system for fast development and optimized production builds
- GitHub Actions workflow for automatic deployment to GitHub Pages
- Simple project structure ready for extension

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build
```

### Deployment

The project is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch.

## GitHub Pages Configuration

This project uses the GitHub Actions workflow defined in `.github/workflows/deploy.yml` to deploy to GitHub Pages. The workflow:

1. Builds the React application using Vite
2. Uploads the build as a Pages artifact
3. Deploys the artifact to GitHub Pages

## License

This project is open source and available under the [MIT License](LICENSE).