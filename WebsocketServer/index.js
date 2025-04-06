const WebSocket = require("ws");
const OSC = require("osc-js");

let learning = false;
let trackHint = null;
let fxHint = null;

const osc = new OSC({
  plugin: new OSC.DatagramPlugin({
    send: { port: 8000 },
    open: { port: 9000 },
  }),
});

osc.open();
osc.on("*", (message) => {
  console.log("Received OSC message:", message);

  if (learning) {
    // Handle messages like /fxparam/<paramNum>/value
    if (/^\/fxparam\/\d+\/value$/.test(message.address)) {
      const addressParts = message.address.split("/");
      const paramNum = parseInt(addressParts[2], 10);

      if (trackHint !== null && fxHint !== null) {
        const learnedParam = {
          type: "fx",
          trackNum: trackHint,
          fxNum: fxHint,
          paramNum: paramNum,
        };

        console.log("Learned parameter:", learnedParam);

        // Send the learned parameter back to the frontend
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ learnedParam }));
          }
        });

        // Disable learn mode
        learning = false;
        trackHint = null;
        fxHint = null;
      }
    }
  }
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

      if (message.learn) {
        // Temporarily disable learning until the flood subsides
        trackHint = message.trackHint || null;
        fxHint = message.fxHint || null;

        console.log("Preparing to enable learn mode", { trackHint, fxHint });

        // Send /device/track/select and /device/fx/select
        if (trackHint !== null) {
          osc.send(new OSC.Message("/device/track/select", trackHint));
        }
        if (fxHint !== null) {
          osc.send(new OSC.Message("/device/fx/select", fxHint));
        }

        // Delay enabling learning to avoid the initial flood
        setTimeout(() => {
          learning = true;
          console.log("Learn mode enabled after delay", { trackHint, fxHint });
        }, 3000); // 3 second delay (adjust as needed)

        return;
      }

      // Create OSC message based on presence of value
      const oscMessage =
        message.value !== undefined
          ? new OSC.Message(message.address, message.value)
          : new OSC.Message(message.address);

      osc.send(oscMessage);
    } catch (error) {
      console.error("Message processing error:", error);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (error) => console.error("WebSocket error:", error));

  ws.send("Welcome to the WebSocket server! You can send OSC messages.");
});
