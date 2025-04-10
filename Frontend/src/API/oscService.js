const connectionListeners = new Set();

export const isConnected = () => ws.readyState === WebSocket.OPEN;

export const addConnectionListener = (listener) => {
  connectionListeners.add(listener);
  // Notify the listener of the current connection state
  listener(ws.readyState === WebSocket.OPEN);
};

export const removeConnectionListener = (listener) => {
  connectionListeners.delete(listener);
};

let learnResolve = null;
let reconnectInterval = null;
let ws = new WebSocket("ws://localhost:8080");

const attemptReconnect = () => {
  if (
    ws.readyState === WebSocket.OPEN ||
    ws.readyState === WebSocket.CONNECTING
  ) {
    return; // Skip if already connected or connecting
  }

  console.log("Attempting to reconnect...");
  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    console.log("Reconnected to WebSocket server");
    connectionListeners.forEach((listener) => listener(true));
    clearInterval(reconnectInterval); // Stop reconnect attempts
    reconnectInterval = null;
  };

  ws.onclose = () => {
    console.log("Disconnected from WebSocket server");
    connectionListeners.forEach((listener) => listener(false));
    if (!reconnectInterval) {
      reconnectInterval = setInterval(attemptReconnect, 5000); // Retry every 5 seconds
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    connectionListeners.forEach((listener) => listener(false));
  };

  ws.onmessage = (event) => {
    try {
      console.log("Received message:", event.data);
      const message = JSON.parse(event.data);
      const { learnedParam } = message;
      if (learnResolve) {
        const { type, trackNum, fxNum, paramNum } = learnedParam;
        learnResolve({ type, trackNum, fxNum, paramNum });
        learnResolve = null;
      }
    } catch (error) {
      console.error("Message parsing error:", error);
    }
  };
};

export const cancelLearn = () => {
  if (learnResolve) {
    learnResolve(null); // Resolve with null to indicate cancellation
    learnResolve = null;
  }
  ws.send(JSON.stringify({ learnCancel: true })); // Notify backend to stop learning
};

export const learnNextParam = (trackHint = null, fxHint = null) => {
  return new Promise((resolve) => {
    learnResolve = resolve;

    // Tell backend we're listening for a learn (optionally with a track hint)
    ws.send(
      JSON.stringify({
        learn: true,
        trackHint: trackHint || null,
        fxHint: fxHint || null,
      })
    );
  });
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
  connectionListeners.forEach((listener) => listener(false));
  if (!reconnectInterval) {
    reconnectInterval = setInterval(attemptReconnect, 5000); // Retry every 5 seconds
  }
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

    ws.send(JSON.stringify(message));
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
