# 🚀 CONTROL: A React + Vite Application with WebSocket and OSC Integration

CONTROL is a modern web application built with React and Vite, designed for real-time control of parameters via WebSocket and OSC (Open Sound Control). The project includes a frontend interface for parameter manipulation and a WebSocket server for OSC message handling. 🎛️⚡

---

## 📜 Table of Contents

- [✨ Features](#features)
- [📂 Project Structure](#project-structure)
- [🚀 Getting Started](#getting-started)
  - [🔧 Prerequisites](#prerequisites)
  - [📥 Installation](#installation)
  - [▶️ Running the Application](#running-the-application)
- [🛠 Usage](#usage)
  - [🎨 Frontend](#frontend)
  - [📡 WebSocket Server](#websocket-server)
- [🛠 Technologies Used](#technologies-used)
- [🤝 Contributing](#contributing)
- [📜 License](#license)

---

## ✨ Features

### **Frontend 🎨**

✅ Built with **React** and **Vite** for fast development and performance.  
✅ **Material-UI** for a sleek and responsive design.  
✅ **Real-time parameter control** using mouse and keyboard inputs.  
✅ **Save, load, and delete** parameter profiles using **local storage**.  
✅ **Interactive canvas** for visual feedback and control.

### **Backend 🖥️**

✅ **WebSocket server** for real-time communication.  
✅ **OSC integration** for sending and receiving control messages.

---

## 📂 Project Structure

```
CONTROL/
├── Frontend/
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── API/          # API utilities (WebSocket, OSC)
│   │   ├── Components/   # React components
│   │   │   ├── controls/ # Canvas and mouse control utilities
│   │   ├── App.jsx       # Main application component
│   │   ├── main.jsx      # Entry point
│   │   ├── index.css     # Global styles
│   ├── package.json      # Frontend dependencies and scripts
│   ├── vite.config.js    # Vite configuration
│   ├── eslint.config.js  # ESLint configuration
│   ├── index.html        # HTML template
├── WebsocketServer/
│   ├── index.js          # WebSocket server with OSC integration
│   ├── package.json      # Backend dependencies and scripts
├── README.md             # Project documentation
├── .gitignore            # Ignored files and directories
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) 🟢
- **npm** or **yarn** 📦

### 📥 Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/control.git
   cd control
   ```
2. **Install dependencies for the frontend:**
   ```sh
   cd Frontend
   npm install
   ```
3. **Install dependencies for the WebSocket server:**
   ```sh
   cd ../WebsocketServer
   npm install
   ```

### ▶️ Running the Application

1. **Start the WebSocket Server:**
   ```sh
   cd WebsocketServer
   node index.js
   ```
2. **Start the Frontend Application:**
   ```sh
   cd ../Frontend
   npm run dev
   ```
3. Open your browser and visit: `http://localhost:5173/` 🌐

---

## 🛠 Usage

### 🎨 **Frontend**

The frontend provides a sleek UI with real-time controls for manipulating OSC parameters. Users can interact with:

- Sliders, buttons, and canvas-based controls.
- WebSocket-driven real-time updates.
- Parameter saving and recall for easy workflow.

### 📡 **WebSocket Server**

The WebSocket server acts as the bridge between the frontend and OSC-enabled applications, ensuring low-latency communication.

---

## 🛠 Technologies Used

🚀 **Frontend:** React, Vite, Material-UI, WebSockets, HTML5 Canvas  
🖥️ **Backend:** Node.js, WebSockets, OSC-js

---

## 🤝 Contributing

Contributions are welcome! 🎉 If you'd like to improve this project, feel free to submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**. 📝
