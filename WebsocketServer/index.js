const WebSocket = require("ws");
const OSC = require("osc-js");

const osc = new OSC({
  plugin: new OSC.DatagramPlugin({
    send: { port: 8000 },
    open: { port: 9000 },
  }),
});

let learning = false;
let trackHint = null;
let fxHint = null;
let learnBuffer = {
  name: null,
  paramNum: null,
};

// Master VU buffer for volume monitoring
const vuBuffer = {
  values: [],
  maxSize: 60, // Buffer size (adjust as needed for visualization)
  lastSendTime: 0,
  sendInterval: 100, // Send data every 100ms to avoid overwhelming the client
};

osc.open();
osc.on("*", (message) => {
  if (message.address === "/master/vu") {
    // Store VU meter data in the buffer
    const vuValue = message.args[0];
    vuBuffer.values.push(vuValue);

    // Keep buffer at desired size
    if (vuBuffer.values.length > vuBuffer.maxSize) {
      vuBuffer.values.shift();
    }

    // Rate limiting for sending VU data to clients
    const now = Date.now();
    if (now - vuBuffer.lastSendTime >= vuBuffer.sendInterval) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.interestedInVolume) {
          client.send(
            JSON.stringify({
              type: "volume",
              data: {
                current: vuValue,
                buffer: vuBuffer.values,
                rms: calculateRMS(vuBuffer.values),
                peak: Math.max(...vuBuffer.values),
              },
            })
          );
        }
      });
      vuBuffer.lastSendTime = now;
    }
    return;
  }
  //console.log("Received OSC message:", message);
  console.log("Received OSC message:", learning, message.address);
  if (!learning) return;
  let count = 0;
  // Capture parameter name
  if (message.address === "/fxparam/last_touched/name" && message.args?.[0]) {
    learnBuffer.name = message.args[0];
    console.log("Captured parameter name:", learnBuffer.name);
  }

  // Capture parameter number from /fxparam/{num}/value
  if (/^\/fxparam\/\d+\/value$/.test(message.address)) {
    learnBuffer.paramNum = parseInt(message.address.split("/")[2], 10);
    console.log("Captured parameter number:", learnBuffer.paramNum);
  }

  if (
    (learnBuffer.name && learnBuffer.paramNum !== null) ||
    (learnBuffer.paramNum !== null && count >= 100)
  ) {
    const learnedParam = {
      type: "fx",
      trackNum: trackHint,
      fxNum: fxHint,
      paramNum: learnBuffer.paramNum,
      name: learnBuffer.name,
    };

    console.log("Learned parameter:", learnedParam);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("Sending learned parameter to client:", learnedParam);
        client.send(JSON.stringify({ learnedParam }));
      }
    });

    resetLearningState();
  }
  count++;
  if (count > 500) {
    console.log("Learning timed out, resetting state.");
    resetLearningState();
  }
});

// Calculate Root Mean Square for better volume visualization
function calculateRMS(values) {
  if (values.length === 0) return 0;
  const sumOfSquares = values.reduce((sum, value) => sum + value * value, 0);
  return Math.sqrt(sumOfSquares / values.length);
}

// Handle OSC errors
osc.on("error", (error) => {
  console.error("OSC error:", error);
});

// --- WebSocket Setup ---

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server started on ws://localhost:8080");
});

wss.on("connection", (ws) => {
  console.log("Client connected");
  // Initialize client-specific properties
  ws.interestedInVolume = false;

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log("Received message:", message);

      // Handle volume subscription request
      if (message.volume === true) {
        ws.interestedInVolume = true;
        // Send immediate response with current volume data
        ws.send(
          JSON.stringify({
            type: "volume",
            data: {
              current:
                vuBuffer.values.length > 0
                  ? vuBuffer.values[vuBuffer.values.length - 1]
                  : 0,
              buffer: vuBuffer.values,
              rms: calculateRMS(vuBuffer.values),
              peak: Math.max(...vuBuffer.values, 0),
            },
          })
        );
        return;
      }

      // Handle volume unsubscription
      if (message.volume === false) {
        ws.interestedInVolume = false;
        return;
      }

      // Cancel learning
      if (message.learnCancel) {
        resetLearningState();
        return;
      }

      // Initiate learning
      if (message.learn) {
        trackHint = message.trackHint ?? null;
        fxHint = message.fxHint ?? null;

        console.log("Preparing to enter learn mode", { trackHint, fxHint });

        if (trackHint !== null) {
          osc.send(new OSC.Message("/device/track/select", trackHint));
        }
        if (fxHint !== null) {
          osc.send(new OSC.Message("/device/fx/select", fxHint));
        }

        learnBuffer = { name: null, paramNum: null };
        learning = true;

        setTimeout(() => {
          if (learning) {
            console.log("Learn mode active after delay");
          }
        }, 5000);

        return;
      }

      // Regular OSC message passthrough
      const oscMessage =
        message.value !== undefined
          ? new OSC.Message(message.address, message.value)
          : new OSC.Message(message.address);

      osc.send(oscMessage);
    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (learning) resetLearningState();
  });

  ws.on("error", (error) => console.error("WebSocket error:", error));
});

// --- Helpers ---

function resetLearningState() {
  learning = false;
  trackHint = null;
  fxHint = null;
  learnBuffer = { name: null, paramNum: null };
  console.log("Learning state reset");
}
