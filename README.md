
# Planit Poker

Planit Poker is an online scrum poker tool designed to facilitate agile team planning sessions. The application allows team members to vote on user stories using cards, providing an interactive and engaging way to reach a consensus. Built with a backend and frontend powered by modern technologies, it offers real-time collaboration and seamless interaction.

## Features

- **Real-time collaboration:** Team members can join rooms and vote simultaneously.
- **Frontend and Backend Separation:** The frontend and backend are built and deployed separately.
- **Docker Support:** Dockerfile and docker-compose support for easy local and production setups.
- **Customizable Themes:** Ability to customize card themes for a more personalized experience.
- **Scalable Architecture:** Designed to handle multiple rooms and users efficiently.

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, NestJS, WebSockets (Socket.IO)
- **Database:** Redis (for session and room management)
- **Real-time Communication:** WebSocket for live voting and updates
- **Docker:** For containerizing both frontend and backend services

## Requirements

- Docker and Docker Compose installed.
- Node.js installed (for local development).

## Setup

### Docker Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/iboio/planit-poker.git
   cd planit-poker
   ```

2. Build the Docker containers:
   ```bash
   docker-compose build
   ```

3. Start the services:
   ```bash
   docker-compose up
   ```

4. Navigate to `http://localhost:3000` in your browser to access the app.

### Local Development Setup

1. Install dependencies for the backend and frontend:
   ```bash
   # For Backend
   cd backend
   npm install

   # For Frontend
   cd frontend
   npm install
   ```

2. Run the backend and frontend in development mode:
   ```bash
   # Backend
   npm run start:dev

   # Frontend
   npm run dev
   ```

3. The application will be available at `http://localhost:3000`.

## Usage

1. Create a new room for the team.
2. Share the room link with your team members.
3. Each member joins the room and votes using the scrum poker cards.
4. Once everyone has voted, the results will be shown, and the session can continue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
