const WebSocket = require("ws");
const OSC = require("osc-js");
const readline = require("readline");

const osc = new OSC({
  plugin: new OSC.DatagramPlugin({
    send: { port: 8000 },
    open: { port: 9000 },
  }),
});

osc.open();
osc.on("error", (error) => console.error("OSC error:", error));

const recentMessages = new Set();

// Handle incoming OSC messages
osc.on("*", (msg) => {
  const key = `${msg.address}|${JSON.stringify(msg.args)}`;
  if (!recentMessages.has(key)) {
    recentMessages.add(key);
    console.log("🟢 Received:", msg.address, msg.args);
  }
});

// Simple terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

function sendOSC(address, ...args) {
  const parsedArgs = args.map((val) => {
    const num = parseFloat(val);
    return isNaN(num) ? val : num;
  });
  const message = new OSC.Message(address, ...parsedArgs);
  osc.send(message);
  console.log(
    `➡️ Sent: ${address}`,
    parsedArgs.length ? parsedArgs : "[no args]"
  );
}

function startLearnWindow(duration = 3000) {
  console.log(
    "👂 Listening for OSC messages for",
    duration / 1000,
    "seconds... Move a knob now!"
  );

  const fullMatches = [];
  const hints = new Map();

  const handler = (msg) => {
    const { address, args } = msg;
    const val = args;

    // Save any messages with fxparam/value and track info
    if (/^\/track\/\d+\/fx\/\d+\/fxparam\/\d+\/value$/.test(address)) {
      fullMatches.push({ address, val });
    }

    // Store potential hints
    if (address.includes("last_touched") || address.includes("fxparam")) {
      hints.set(address, val);
    }
  };

  osc.on("*", handler);

  setTimeout(() => {
    if (fullMatches.length) {
      console.log("✅ Found full OSC param address:");
      fullMatches.forEach(({ address, val }) =>
        console.log(" -", address, val)
      );
    } else if (hints.size) {
      console.log("⚠️  No full address, but found possible hints:");
      for (const [addr, val] of hints.entries()) {
        console.log(" -", addr, val);
      }
    } else {
      console.log("❌ No OSC messages received.");
    }
    rl.prompt();
  }, duration);
}

console.log("🎛️  OSC Test Server Ready. Type a command:");
rl.prompt();

rl.on("line", (line) => {
  const [cmd, ...args] = line.trim().split(/\s+/);
  if (cmd === "learn") {
    startLearnWindow(3000);
  } else if (cmd.startsWith("/")) {
    sendOSC(cmd, ...args);
  } else {
    console.log("❓ Unknown command:", cmd);
  }
  rl.prompt();
});
