🎛️ OSC Visual Controller
A modular, browser-based OSC controller for REAPER with interactive visual control surfaces.

Overview
This project provides a dynamic frontend interface to control REAPER parameters via OSC, using intuitive, real-time visual interactions such as mouse movement, particle simulations, and interactive canvases. It supports value mapping and customizable control behaviors for expressive DAW manipulation.

How It Works
Client (this repo): Web-based controller UI built with React. Sends OSC messages based on interactive visuals (mouse, ball, chaos, etc.).

Server: A lightweight WebSocket/OSC bridge relays communication between REAPER and the client.

DAW (REAPER): Sends and receives OSC messages. Currently, the OSC setup in REAPER is configured to forward certain parameter messages to the WebSocket server, enabling limited bidirectional communication.

Features
🔗 OSC Address Mapping – Assign any control surface to an OSC path.

🎚️ Value Mapping – Shape input values (e.g., Mouse X, Ball Y) to desired output curves.

🧩 Modular Visualizers – Refactoring in progress for node-based simulation control and scalable parameter assignment.

🔄 Live Communication – Real-time message sending; partial response handling via WebSocket.

Current Status
✅ OSC control routing

✅ Value mapping editor

🔧 Refactoring visualizer architecture for node-based flexibility

🚧 No persistent state or presets (yet)
