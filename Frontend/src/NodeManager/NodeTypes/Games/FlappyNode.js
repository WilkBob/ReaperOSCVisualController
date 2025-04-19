import { makeBlueprint } from "../BaseNode";

const FlappyNode = makeBlueprint({
  type: "game", // Or "visualizer", "simulation" - choose what fits best
  label: "Flappy Bird",
  inputDefs: [
    { name: "Threshold", defaultValue: 0.5, label: "Jump Threshold" },
    { name: "JumpInput", defaultValue: 0, label: "Jump Signal" },
  ],
  outputDef: { name: "Height", label: "Bird Height" },

  init: (globalState, localState) => {
    // Ensure UI object exists and set defaults
    if (!localState.ui) localState.ui = {};
    localState.ui.width = 200;
    localState.ui.height = 150;
    if (!localState.ui.position) localState.ui.position = { x: 0, y: 0 };

    // Create drawing canvas
    localState.drawImage = document.createElement("canvas");
    localState.drawImage.width = localState.ui.width;
    localState.drawImage.height = localState.ui.height;
    localState.ctx = localState.drawImage.getContext("2d");

    // Game constants
    localState.gravity = 980; // Pixels per second squared
    localState.jumpStrength = 350; // Upward velocity impulse in pixels per second
    localState.birdRadius = 10;
    localState.towerWidth = 20;
    localState.towerGapHeight = 70; // Increased from 60 (approx 10% bigger)
    localState.towerSpeed = 130; // Pixels per second

    localState.towerSpawnInterval = 2;
    // Game state initialization function
    localState.resetGame = () => {
      console.log("FlappyNode: Resetting game");
      localState.bird = {
        x: localState.ui.width * 0.25,
        y: localState.ui.height / 2,
        velocityY: 0,
      };
      localState.towers = [];
      localState.timeSinceLastSpawn = localState.towerSpawnInterval; // Spawn immediately
      localState.score = 0;
      localState.gameOver = false;
      localState.lastJumpInput = 0; // Reset last jump input state
      localState.jumpTriggeredThisFrame = false; // Prevent multi-jump on single input
    };

    // Initialize game state
    localState.resetGame();

    // Initialize evaluated inputs (using defaults)
    localState.evaluatedInputs = [0.5, 0];
  },

  update: (globalState, localState) => {
    const { ctx, ui, bird, towers } = localState;
    const { width, height } = ui;
    const { deltaTime } = globalState;
    const [threshold, jumpInput] = localState.evaluatedInputs;

    // Resize canvas if node size changed
    if (
      width !== localState.drawImage.width ||
      height !== localState.drawImage.height
    ) {
      localState.drawImage.width = width;
      localState.drawImage.height = height;
      // Potentially adjust game element sizes/positions based on new dimensions if needed
      // For simplicity, we'll keep fixed sizes for now. Reset might be needed.
      // localState.resetGame(); // Consider resetting if size changes drastically
    }

    // --- Game Logic ---

    // Check for jump trigger (only once per crossing threshold)
    const shouldJump =
      jumpInput > threshold && localState.lastJumpInput <= threshold;
    if (shouldJump && !localState.gameOver) {
      bird.velocityY = -localState.jumpStrength;
      localState.jumpTriggeredThisFrame = true; // Mark jump happened
    } else {
      localState.jumpTriggeredThisFrame = false;
    }
    localState.lastJumpInput = jumpInput; // Store for next frame comparison

    // If game over, check for reset condition (e.g., jump input again)
    if (localState.gameOver && shouldJump) {
      localState.resetGame();
      // Apply the jump immediately after reset
      bird.velocityY = -localState.jumpStrength;
      localState.jumpTriggeredThisFrame = true;
    }

    if (!localState.gameOver) {
      // Apply gravity
      bird.velocityY += localState.gravity * deltaTime;

      // Update bird position
      bird.y += bird.velocityY * deltaTime;

      // Spawn towers
      localState.timeSinceLastSpawn += deltaTime;
      if (localState.timeSinceLastSpawn >= localState.towerSpawnInterval) {
        const minGapY = height * 0.2;
        const maxGapY = height * 0.8 - localState.towerGapHeight;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        towers.push({
          x: width, // Start off-screen right
          gapY: gapY,
          scored: false,
        });
        localState.timeSinceLastSpawn = 0;
      }

      // Move towers and check for scoring/despawning
      for (let i = towers.length - 1; i >= 0; i--) {
        const tower = towers[i];
        tower.x -= localState.towerSpeed * deltaTime;

        // Scoring
        if (!tower.scored && tower.x + localState.towerWidth < bird.x) {
          localState.score++;
          tower.scored = true;
          // console.log("Score:", localState.score); // Optional score logging
        }

        // Despawn
        if (tower.x + localState.towerWidth < 0) {
          towers.splice(i, 1);
        }
      }

      // Collision Detection
      // 1. Boundaries
      if (
        bird.y - localState.birdRadius < 0 ||
        bird.y + localState.birdRadius > height
      ) {
        localState.gameOver = true;
        console.log("FlappyNode: Game Over (Boundary Collision)");
      }
      // 2. Towers
      for (const tower of towers) {
        // Check horizontal overlap
        if (
          bird.x + localState.birdRadius > tower.x &&
          bird.x - localState.birdRadius < tower.x + localState.towerWidth
        ) {
          // Check vertical collision (if bird is NOT within the gap)
          if (
            bird.y - localState.birdRadius < tower.gapY ||
            bird.y + localState.birdRadius >
              tower.gapY + localState.towerGapHeight
          ) {
            localState.gameOver = true;
            console.log("FlappyNode: Game Over (Tower Collision)");
            break; // No need to check other towers
          }
        }
      }
    }

    // --- Drawing ---
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = localState.gameOver
      ? "rgba(100, 50, 50, 0.8)"
      : "rgba(50, 50, 100, 0.8)";
    ctx.fillRect(0, 0, width, height);

    // Draw Towers
    ctx.fillStyle = "rgba(50, 200, 50, 0.9)";
    towers.forEach((tower) => {
      // Top part
      ctx.fillRect(tower.x, 0, localState.towerWidth, tower.gapY);
      // Bottom part
      ctx.fillRect(
        tower.x,
        tower.gapY + localState.towerGapHeight,
        localState.towerWidth,
        height - (tower.gapY + localState.towerGapHeight)
      );
    });

    // Draw Bird
    ctx.fillStyle = "rgba(255, 255, 0, 0.9)";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, localState.birdRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Score
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${localState.score}`, 10, 20);

    // Draw Game Over message
    if (localState.gameOver) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", width / 2, height / 2 - 10);
      ctx.font = "14px Arial";
      ctx.fillText("Jump again to restart", width / 2, height / 2 + 10);
    }
  },

  evaluate: (inputs, globalState, localState) => {
    // Output normalized height (0 at bottom, 1 at top) if game is running, else 0
    if (localState.gameOver || !localState.ui || localState.ui.height === 0) {
      return 0;
    }
    // Clamp value between 0 and 1
    const normalizedHeight = 1 - localState.bird.y / localState.ui.height;
    return Math.max(0, Math.min(1, normalizedHeight));
  },

  destroy: (localState) => {
    // Nothing specific to destroy for canvas 2d context usually
    localState.ctx = null;
    localState.drawImage = null;
    localState.bird = null;
    localState.towers = null;
    console.log("FlappyNode destroyed");
  },
});

export default FlappyNode;
