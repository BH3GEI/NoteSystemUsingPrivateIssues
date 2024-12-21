# Note System Using Private Issues

A Vue-based note-taking application that uses GitHub Issues as a backend storage system. This application provides a clean, modern interface for managing your notes while leveraging GitHub's infrastructure for data persistence.

## Features

- 🔐 Secure authentication using GitHub Personal Access Token
- 📝 Rich Markdown editing with real-time preview
- 📁 Folder organization using GitHub labels
- 🖼️ Support for images and rich media in notes
- 📱 Responsive design for both desktop and mobile use
- 🔄 Version control through GitHub's issue history

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a GitHub Personal Access Token with the following permissions:
   - repo (full access to private repositories)
   - read:user
   - user:email

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Configuration

Before using the application, you need to set up your GitHub repository information:
1. Create a new private GitHub repository to store your notes
2. Update the repository owner and name in the application code
3. Generate a GitHub Personal Access Token with the required permissions

## Technologies Used

- Vue 3 with Composition API
- Vue Router for navigation
- Tailwind CSS for styling
- Marked for Markdown rendering
- GitHub REST API for data storage
- Vite for build tooling

## Security

This application stores your GitHub Personal Access Token in the browser's localStorage. The token never leaves your browser and is only used to communicate directly with GitHub's API. No data is stored on any third-party servers.
