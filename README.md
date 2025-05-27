# SyncShell

SyncShell is a web-based, real-time collaborative terminal that enables multiple users to work together on a shared terminal session with role-based permissions (e.g., read-only, write access). Designed for remote teams, it simplifies debugging, server management, and collaborative coding directly from the browser.

## Why SyncShell?
- **Real-Time Collaboration**: Multiple users can interact with the same terminal session instantly, with updates synced via WebSockets.
- **Role-Based Permissions**: Assign read-only or write access to collaborators for secure and controlled workflows.
- **Lightweight and Accessible**: Runs in any modern browser, no local setup required beyond the server.
- **Developer-Friendly**: Built with a minimal, modern tech stack, making it easy to extend and contribute.

## Features
- Real-time terminal session sharing with low-latency updates
- Role-based access control (admin, write, read-only)
- Responsive web-based terminal interface powered by xterm.js
- Secure WebSocket communication with Socket.IO
- Session management (create, join, or leave sessions)
- Cross-platform compatibility (works on any modern browser)
- Extensible architecture for adding custom commands or integrations

## Tech Stack
- **Backend**:
  - **Node.js**: Lightweight, non-blocking runtime for the server.
  - **Express**: Minimal web framework for handling API routes.
  - **Socket.IO**: Enables real-time, bidirectional communication for terminal updates.
- **Frontend**:
  - **React**: Modern, component-based UI for the terminal interface.
  - **xterm.js**: Industry-standard library for terminal emulation in the browser.
- **Other**:
  - **WebSocket**: Ensures low-latency, real-time collaboration.
  - **npm**: Package manager for dependencies.

## Getting Started

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- A modern web browser (Chrome, Firefox, Edge, etc.)

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/makalin/syncshell.git
   cd syncshell
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=3000
   SESSION_SECRET=your-secret-key
   ```
   Replace `your-secret-key` with a secure string for session authentication.
4. **Start the Server**:
   ```bash
   npm start
   ```
5. **Access SyncShell**:
   Open your browser and navigate to `http://localhost:3000`.

### Running in Development Mode
For development with hot reloading:
```bash
npm run dev
```

## Usage
1. **Create a Session**:
   - Visit the SyncShell web interface and click "Create Session."
   - Copy the unique session URL to share with collaborators.
2. **Join a Session**:
   - Paste the session URL in your browser to join an existing session.
3. **Manage Permissions**:
   - As the session host, assign roles (admin, write, read-only) to participants via the UI.
4. **Collaborate**:
   - Write-enabled users can execute commands in the shared terminal.
   - Read-only users can view real-time updates without modifying the session.
5. **End Session**:
   - The host can terminate the session, closing access for all participants.

## Architecture Overview
- **Frontend**:
  - React components render the terminal UI using xterm.js.
  - Socket.IO client handles real-time input/output syncing with the server.
- **Backend**:
  - Express server manages API endpoints for session creation and user authentication.
  - Socket.IO server broadcasts terminal input/output to connected clients.
  - Role-based permissions are enforced server-side to ensure security.
- **Communication**:
  - WebSocket connections via Socket.IO ensure low-latency updates.
  - Commands and outputs are serialized and broadcast to all session participants.

## Project Structure
```
syncshell/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components (e.g., Terminal, Permissions)
│   │   ├── App.js         # Main React app
│   │   └── index.js       # Entry point for frontend
├── server/                 # Node.js backend
│   ├── routes/            # Express API routes
│   ├── sockets/           # Socket.IO logic for real-time communication
│   └── index.js           # Main server file
├── .env                   # Environment variables
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

## Contributing
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description of your changes.

Please ensure your code follows the project's coding standards and includes tests where applicable.

## Roadmap
- Add support for session recording and playback
- Implement end-to-end encryption for terminal sessions
- Add syntax highlighting for command outputs
- Support for custom terminal themes
- Integrate with popular DevOps tools (e.g., Docker, Kubernetes)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or feedback, open an issue on GitHub or reach out via [makalin@gmail.com](mailto:makalin@gmail.com).
