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
const ws = new WebSocket("ws://localhost:8080");

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

ws.onopen = () => {
  console.log("Connected to WebSocket server");
  connectionListeners.forEach((listener) => listener(true));
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
  connectionListeners.forEach((listener) => listener(false));
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
      // Format: /learned_param <type> <trackNum> <fxNum> <paramNum>
      const { type, trackNum, fxNum, paramNum } = learnedParam;
      learnResolve({ type, trackNum, fxNum, paramNum });
      learnResolve = null;
    }
  } catch (error) {
    console.error("Message parsing error:", error);
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
