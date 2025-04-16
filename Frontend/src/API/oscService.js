const connectionListeners = new Set();
let learnResolve = null;
let reconnectInterval = null;
let ws = null; // Initialize as null first
// Track the connection state separately to ensure consistency
let connectionState = false;
// Queue for messages that need to be sent when connection is established
let messageQueue = [];
const MAX_QUEUE_SIZE = 100;

// Function to notify all listeners of connection state changes
const notifyListeners = (isConnected) => {
  connectionState = isConnected;
  console.log(
    `Notifying ${connectionListeners.size} listeners of connection state: ${isConnected}`
  );
  connectionListeners.forEach((listener) => {
    try {
      listener(isConnected);
    } catch (error) {
      console.error("Error in connection listener:", error);
    }
  });

  // Process queued messages when connection is established
  if (isConnected && messageQueue.length > 0) {
    console.log(`Processing ${messageQueue.length} queued messages`);
    while (messageQueue.length > 0) {
      const { jsonMessage } = messageQueue.shift();
      try {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(jsonMessage);
        }
      } catch (error) {
        console.error("Error sending queued message:", error);
      }
    }
  }
};

// Setup WebSocket with all event handlers
const setupWebSocket = () => {
  try {
    console.log("Setting up new WebSocket connection...");
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      notifyListeners(true);
      clearInterval(reconnectInterval); // Stop reconnect attempts
      reconnectInterval = null;
    };

    socket.onclose = (event) => {
      console.log(
        `Disconnected from WebSocket server: ${event.code} - ${event.reason}`
      );
      notifyListeners(false);
      if (!reconnectInterval) {
        reconnectInterval = setInterval(attemptReconnect, 5000); // Retry every 5 seconds
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Don't call notifyListeners here as onclose will be called next
      // which would result in duplicate notifications
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { learnedParam } = message;
        if (learnResolve && learnedParam) {
          const { type, trackNum, fxNum, paramNum, name } = learnedParam;
          learnResolve({ type, trackNum, fxNum, paramNum, name });
          learnResolve = null;
        }
      } catch (error) {
        console.error("Message parsing error:", error);
      }
    };

    return socket;
  } catch (error) {
    console.error("Error creating WebSocket:", error);
    if (!reconnectInterval) {
      reconnectInterval = setInterval(attemptReconnect, 5000);
    }
    return null;
  }
};

// Safely send a message, queue it if not connected
const safeSend = (jsonMessage) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(jsonMessage);
    return true;
  } else {
    // Queue the message to be sent when connected
    if (messageQueue.length < MAX_QUEUE_SIZE) {
      messageQueue.push({ jsonMessage });
      console.log(`Message queued. Queue size: ${messageQueue.length}`);
    } else {
      console.warn("Message queue full, dropping oldest message");
      messageQueue.shift(); // Remove oldest message
      messageQueue.push({ jsonMessage });
    }

    // Try to reconnect if not already trying
    if (!reconnectInterval) {
      reconnectInterval = setInterval(attemptReconnect, 5000);
    }
    return false;
  }
};

// Initialize WebSocket
try {
  ws = setupWebSocket();
} catch (error) {
  console.error("Error during initial WebSocket setup:", error);
  // Set up reconnect interval
  if (!reconnectInterval) {
    reconnectInterval = setInterval(attemptReconnect, 5000);
  }
}

// Returns the actual current connection state
export const isConnected = () => connectionState;

export const addConnectionListener = (listener) => {
  connectionListeners.add(listener);
  // Notify the new listener of the current connection state immediately
  try {
    listener(connectionState);
  } catch (error) {
    console.error("Error in initial connection listener notification:", error);
  }
};

export const removeConnectionListener = (listener) => {
  connectionListeners.delete(listener);
};

const attemptReconnect = () => {
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    console.log("Already connected or connecting, skipping reconnect attempt");
    return;
  }

  console.log("Attempting to reconnect...");
  try {
    ws = setupWebSocket();
  } catch (error) {
    console.error("Error during reconnect attempt:", error);
  }
};

export const cancelLearn = () => {
  if (learnResolve) {
    learnResolve(null); // Resolve with null to indicate cancellation
    learnResolve = null;
  }

  // Only send if connected, otherwise just drop this message
  if (ws && ws.readyState === WebSocket.OPEN) {
    safeSend(JSON.stringify({ learnCancel: true }));
  }
};

export const learnNextParam = (trackHint, fxHint) => {
  return new Promise((resolve) => {
    learnResolve = resolve;

    // Tell backend we're listening for a learn (optionally with a track hint)
    safeSend(
      JSON.stringify({
        learn: true,
        trackHint: trackHint,
        fxHint: fxHint,
      })
    );
  });
};

export function createOSCAddress(param) {
  const { type, trackNum, fxNum, paramNum } = param;
  switch (type) {
    case "vol":
      return `/track/${trackNum}/volume`;
    case "inst":
      return `/track/${trackNum}/fxinstparam/${paramNum}/value`;
    case "fx":
      return `/track/${trackNum}/fx/${fxNum}/fxparam/${paramNum}/value`;
    case "fxWet": // New case for wet/dry mix
      return `/track/${trackNum}/fx/${fxNum}/wetdry`;
    case "pan":
      return `/track/${trackNum}/pan`;
    case "sendvol":
      return `/track/${trackNum}/send/${fxNum}/volume`;
    default:
      throw new Error(`Unknown parameter type: ${type}`);
  }
}

export function extractParametersFromAddress(address) {
  // Define separate regular expressions for each address pattern
  const volRegex = /\/track\/(\d+)\/volume/;
  const instRegex = /\/track\/(\d+)\/fxinstparam\/(\d+)\/value/;
  const fxRegex = /\/track\/(\d+)\/fx\/(\d+)\/fxparam\/(\d+)\/value/;
  const fxWetRegex = /\/track\/(\d+)\/fx\/(\d+)\/wetdry/;
  const panRegex = /\/track\/(\d+)\/pan/;
  const sendvolRegex = /\/track\/(\d+)\/send\/(\d+)\/volume/;

  let match;

  match = address.match(volRegex);
  if (match) {
    return { type: "vol", trackNum: parseInt(match[1], 10) };
  }

  match = address.match(instRegex);
  if (match) {
    return {
      type: "inst",
      trackNum: parseInt(match[1], 10),
      paramNum: parseInt(match[2], 10),
    };
  }

  match = address.match(fxRegex);
  if (match) {
    return {
      type: "fx",
      trackNum: parseInt(match[1], 10),
      fxNum: parseInt(match[2], 10),
      paramNum: parseInt(match[3], 10),
    };
  }

  match = address.match(fxWetRegex);
  if (match) {
    return {
      type: "fxWet",
      trackNum: parseInt(match[1], 10),
      fxNum: parseInt(match[2], 10),
    };
  }

  match = address.match(panRegex);
  if (match) {
    return { type: "pan", trackNum: parseInt(match[1], 10) };
  }

  match = address.match(sendvolRegex);
  if (match) {
    return {
      type: "sendvol",
      trackNum: parseInt(match[1], 10),
      fxNum: parseInt(match[2], 10),
    };
  }

  console.warn(`Invalid OSC address: ${address}`);
  return { type: "custom", trackNum: 0, fxNum: 0, paramNum: 0 }; // Default case for custom address
}

export function sendMessage(address, value) {
  try {
    const message = value !== undefined ? { address, value } : { address };
    safeSend(JSON.stringify(message));
  } catch (error) {
    console.error("Send error:", error);
    throw error; // Propagate error to caller
  }
}

export function play() {
  sendMessage("/play");
}

export function stop() {
  sendMessage("/stop");
}

export function record() {
  sendMessage("/record");
}

export function toggleMetronome() {
  sendMessage("/click");
}

export function sendValue(param, value) {
  try {
    const address = createOSCAddress(param);
    console.log(address, value);
    sendMessage(address, parseFloat(value));
  } catch (error) {
    console.error("Send parameter error:", error);
  }
}
