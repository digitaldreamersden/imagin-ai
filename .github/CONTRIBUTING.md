# Contributing to imagin-ai

Thank you for your interest in contributing to imagin-ai! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Guidelines](#development-guidelines)
  - [Code Style](#code-style)
  - [Commit Messages](#commit-messages)
  - [Testing](#testing)
- [Project Structure](#project-structure)
- [Questions?](#questions)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/imagin-ai.git
   cd imagin-ai
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/imagin-ai.git
   ```

## Development Setup

### Prerequisites

- **Node.js** v20 or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Ollama** installed and running (for local AI model support)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Set up environment variables** (if needed):
   - Copy any `.env.example` files to `.env` and configure as needed
   - Ensure Ollama is running if using local models

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

### Running Linting

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check the existing issues to see if the problem has already been reported.

When creating a bug report, please include:

- **A clear, descriptive title**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** (if applicable)
- **Environment information**:
  - Node.js version
  - Package manager and version
  - Operating system
  - Browser (if applicable)
- **Error messages** or logs (if any)

### Suggesting Features

Feature suggestions are welcome! When suggesting a feature:

- **Check existing issues** to see if the feature has been discussed
- **Provide a clear description** of the feature and its use case
- **Explain why** this feature would be valuable to the project
- **Consider implementation details** if you have ideas

### Submitting Pull Requests

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**:
   - Write clean, maintainable code
   - Follow the project's code style
   - Add comments where necessary
   - Update documentation if needed

3. **Test your changes**:
   - Ensure the app runs without errors
   - Test the functionality you've added/modified
   - Run linting to check for style issues

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   See [Commit Messages](#commit-messages) for guidelines.

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with:
     - A clear title and description
     - What changes were made and why
     - Any related issues
     - Screenshots (if applicable)

7. **Keep your PR up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   git push origin feature/your-feature-name --force-with-lease
   ```

## Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for type safety
- **React**: Follow React best practices and hooks patterns
- **Formatting**: The project uses ESLint - ensure your code passes linting
- **Naming**: Use descriptive, camelCase names for variables and functions
- **Components**: Keep components focused and reusable
- **Comments**: Add comments for complex logic, but prefer self-documenting code

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, missing semicolons, etc.)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

Example:
```
feat: add image history persistence
fix: resolve streaming image generation error
docs: update README with Ollama setup instructions
```

### Testing

- Test your changes manually in the development environment
- Ensure existing functionality still works
- Test edge cases and error handling
- If adding new features, test with different AI models if applicable

### Project Structure

```
imagin-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
├── .github/              # GitHub configuration
│   ├── CODE_OF_CONDUCT.md
│   └── CONTRIBUTING.md
└── package.json          # Project dependencies
```

Key areas to understand:
- **API Routes** (`app/api/`): Handle image generation requests
- **Components** (`app/components/`): Reusable UI components
- **Hooks** (`app/hooks/`): Custom React hooks for state management
- **Utils** (`app/utils/`): Helper functions and utilities

## Questions?

If you have questions about contributing:

- **Open an issue** with the `question` label
- **Check existing issues** and discussions
- **Review the documentation** in the README

## License

By contributing to imagin-ai, you agree that your contributions will be licensed under the Apache License 2.0, the same license that covers the project.

Thank you for contributing to imagin-ai! 🎨✨
