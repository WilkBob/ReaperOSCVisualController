import { useCallback, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import useMouseControl from "./UseMouseControl";

const MouseControlCanvas = ({
  trackX,
  trackY,
  trackBallX,
  trackBallY,
  onUpdateX,
  onUpdateY,
  onUpdateBallX,
  onUpdateBallY,
  trackClick,
  onUpdateClick,
}) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastClickState = useRef(false);

  const { mousePosRef, ballRef, clickedRef } = useMouseControl({
    trackX,
    trackY,
    trackBallX,
    trackBallY,
    trackClick,
    onUpdateX,
    onUpdateY,
    onUpdateBallX,
    onUpdateBallY,
    onUpdateClick,
  });
  const prevTrackBallX = useRef(trackBallX);
  const prevTrackBallY = useRef(trackBallY);
  const drawTrackingInfo = useCallback(
    (ctx) => {
      // Draw stats in upper left corner
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.textAlign = "left";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 3;

      const textLines = [
        `Mouse X: ${mousePosRef.current.x.toFixed(2)}`,
        `Mouse Y: ${mousePosRef.current.y.toFixed(2)}`,
        `Ball X: ${ballRef.current.x.toFixed(2)}`,
        `Ball Y: ${ballRef.current.y.toFixed(2)}`,
        `BallVel: x-${ballRef.current.vx} y-${ballRef.current.vy}`,
        `Clicked: ${clickedRef.current ? "Yes" : "No"}`,
        `Particles: ${particles.current.length}`,
      ];

      textLines.forEach((line, index) => {
        ctx.fillText(line, 20, 80 + index * 25);
      });
    },
    [ballRef, clickedRef, mousePosRef]
  );

  // Update particle positions and properties
  const updateParticles = () => {
    particles.current = particles.current
      .map((p) => ({
        ...p,
        x: p.x + p.speedX,
        y: p.y + p.speedY,
        life: p.life - 1,
        size: p.size * 0.99,
      }))
      .filter((p) => p.life > 0);
  };

  // Draw all particles
  const drawParticles = (ctx) => {
    particles.current.forEach((particle) => {
      ctx.globalAlpha = particle.life / 100;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };

  // Add particles on mouse movement
  const addParticle = (x, y, canvas, burst = false) => {
    const count = burst ? 20 : 1;
    const newParticles = [];

    for (let i = 0; i < count; i++) {
      const speed = burst ? 5 : 2;
      const size = burst ? Math.random() * 8 + 4 : Math.random() * 5 + 2;
      const life = burst ? 120 : 80;

      newParticles.push({
        x: x * canvas.width,
        y: y * canvas.height,
        size: size,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        life: life,
        color: burst
          ? `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`
          : `hsl(${Math.floor(x * 360)}, 80%, 50%)`,
      });
    }

    // Limit particles to prevent performance issues
    particles.current = [...particles.current, ...newParticles].slice(-300);
  };

  const drawCanvas = useCallback(
    (
      ctx,
      canvas,
      { mousePos, ball, clicked, trackBallX, trackBallY, trackClick }
    ) => {
      // Update all particles
      updateParticles();

      // Check for mouse movement to create particles
      const { x: mouseX, y: mouseY } = mousePos;
      const distance = Math.sqrt(
        Math.pow(mouseX - lastMousePos.current.x, 2) +
          Math.pow(mouseY - lastMousePos.current.y, 2)
      );

      // Create particles on mouse movement
      if (distance > 0.003 && (trackX || trackY)) {
        addParticle(mouseX, mouseY, canvas);
        lastMousePos.current = { x: mouseX, y: mouseY };
      }

      // Create burst of particles on click
      if (clicked && !lastClickState.current && trackClick) {
        addParticle(mouseX, mouseY, canvas, true);
        lastClickState.current = true;
      } else if (!clicked && lastClickState.current) {
        lastClickState.current = false;
      }

      // Draw background with fade effect for trails
      ctx.fillStyle = `rgba(${Math.floor(mouseX * 20)}, ${Math.floor(
        mouseY * 20
      )}, 30, 0.15)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw all particles
      drawParticles(ctx);

      // Draw ball
      if (trackBallX || trackBallY) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x <= 0 || ball.x >= 1) ball.vx *= -1;
        if (ball.y <= 0 || ball.y >= 1) ball.vy *= -1;

        // Call onUpdateBallX and onUpdateBallY if tracking is enabled
        if (trackBallX) onUpdateBallX(ball.x);
        if (trackBallY) onUpdateBallY(ball.y);

        // Draw gradient around the ball
        const gradient = ctx.createRadialGradient(
          ball.x * canvas.width,
          ball.y * canvas.height,
          0,
          ball.x * canvas.width,
          ball.y * canvas.height,
          50
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          ball.x * canvas.width,
          ball.y * canvas.height,
          50,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Draw the actual ball
        ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
        ctx.beginPath();
        ctx.arc(
          ball.x * canvas.width,
          ball.y * canvas.height,
          15,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      if (clicked && trackClick) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          mousePos.x * canvas.width,
          mousePos.y * canvas.height,
          25,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          mousePos.x * canvas.width,
          mousePos.y * canvas.height,
          10,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(
          mousePos.x * canvas.width,
          mousePos.y * canvas.height,
          8,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      //Draw all values being tracked on screen in a nice way (e.g. mouseX: 0.9)
      drawTrackingInfo(ctx);
    },
    [trackX, trackY, onUpdateBallX, onUpdateBallY, drawTrackingInfo]
  );
  useEffect(() => {
    prevTrackBallX.current = trackBallX;
    prevTrackBallY.current = trackBallY;
  }, [trackBallX, trackBallY]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId = null;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Add click handler directly to canvas as backup
    const handleClick = (e) => {
      if (!trackClick) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / canvas.width;
      const y = (e.clientY - rect.top) / canvas.height;

      addParticle(x, y, canvas, true);
    };

    window.addEventListener("click", handleClick);

    const animate = () => {
      drawCanvas(ctx, canvas, {
        mousePos: mousePosRef.current,
        ball: ballRef.current,
        clicked: clickedRef.current,
        trackBallX,
        trackBallY,
        trackClick,
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleClick);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [
    trackBallX,
    trackBallY,
    trackClick,
    mousePosRef,
    ballRef,
    clickedRef,
    drawCanvas,
  ]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default MouseControlCanvas;
