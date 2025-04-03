const WebSocket = require("ws");
const OSC = require("osc-js");

const osc = new OSC({
  plugin: new OSC.DatagramPlugin({
    send: { port: 8000 },
    open: { port: 9000 },
  }),
});

osc.open();
osc.on("*", (message) => {
  console.log("Received OSC message:", message);
});
osc.on("error", (error) => {
  console.error("OSC error:", error);
});

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server started on ws://localhost:8080");
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log("Received message:", message);

      // Create OSC message based on presence of value
      const oscMessage =
        message.value !== undefined
          ? new OSC.Message(message.address, message.value)
          : new OSC.Message(message.address);

      osc.send(oscMessage);
      // console.log("Sent OSC message:", oscMessage);
    } catch (error) {
      console.error("Message processing error:", error);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (error) => console.error("WebSocket error:", error));

  ws.send("Welcome to the WebSocket server! You can send OSC messages.");
});
