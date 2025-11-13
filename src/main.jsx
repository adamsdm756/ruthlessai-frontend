import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.css"; // TailwindCSS

// === GLOBAL MATRIX BACKGROUND CANVAS (REPLACES ALL NORMAL BACKGROUND) ===
const matrixCanvas = document.createElement("canvas");
matrixCanvas.id = "matrix-canvas-global";
matrixCanvas.style.position = "fixed";
matrixCanvas.style.top = "0";
matrixCanvas.style.left = "0";
matrixCanvas.style.width = "100vw";
matrixCanvas.style.height = "100vh";
matrixCanvas.style.zIndex = "-999999";
matrixCanvas.style.pointerEvents = "none";
document.body.appendChild(matrixCanvas);

const ctx = matrixCanvas.getContext("2d");

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
}
resizeMatrix();
window.addEventListener("resize", resizeMatrix);

const chars = "01";
const fontSize = 16;
let drops = [];

function initDrops() {
  drops = Array(Math.floor(matrixCanvas.width / fontSize)).fill(1);
}
initDrops();
window.addEventListener("resize", initDrops);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  ctx.fillStyle = "#00ff88";
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, y * fontSize);

    if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

setInterval(drawMatrix, 33);

// === REACT RENDER ===
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
