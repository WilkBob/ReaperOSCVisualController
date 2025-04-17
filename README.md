🎛️ OSC Visual Controller
A modular, browser-based OSC controller for REAPER with interactive visual control surfaces and node-based parameter routing.

Overview
This project provides a dynamic frontend interface to control REAPER parameters via OSC, using intuitive, real-time visual interactions such as mouse movement, oscillators, and interactive node graphs. It supports value mapping and customizable control behaviors for expressive DAW manipulation.

How It Works
Client (this repo): Web-based controller UI built with React. Sends OSC messages based on node-based visual programming (constants, oscillators, math operations, etc.).

Server: A lightweight WebSocket/OSC bridge relays communication between REAPER and the client.

DAW (REAPER): Sends and receives OSC messages. Currently, the OSC setup in REAPER is configured to forward certain parameter messages to the WebSocket server, enabling limited bidirectional communication.

Features
🔗 OSC Address Mapping – Assign any node output to an OSC path.

🎚️ Value Mapping – Shape input values using a complete node-based system with math operations, oscillators, and constants.

🧩 Node-Based Visualizers – Create complex control flows by connecting nodes visually with an interactive graph editor.

🔄 Live Communication – Real-time message sending; partial response handling via WebSocket.

🎛️ Interactive Editor – Drag, resize, and connect nodes to build custom control surfaces and parameter processing chains.

Current Status
✅ OSC control routing

✅ Value mapping editor

✅ Node-based visual programming interface

✅ Interactive node connections and editing

🚧 No persistent state or presets (yet)

Upcoming Features
🔜 Expanded Node Library – Additional math functions, audio analysis, gesture recognition, and more complex processing nodes

🔜 Save/Load Node Graphs – Store and share node configurations via JSON export/import

🔜 Specialized Visual Simulations – Physics-based, audio-reactive, and interactive visual environments with dedicated I/O nodes

🔜 Performance Optimization – Multithreaded node processing for complex graphs and high-frequency updates

🔜 Custom Node Creation – Build and share your own nodes
