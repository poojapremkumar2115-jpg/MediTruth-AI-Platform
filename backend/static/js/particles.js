/* ==========================================
   MEDITRUTH AI - NEURAL NETWORK CANVAS ANIMATION
   ========================================== */

(function () {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  let w, h;

  // Set size
  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Mouse vector tracking
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("mouseleave", function () {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Node Blueprint
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.density = (Math.random() * 30) + 1;
    }

    update() {
      // Bounce check
      if (this.x > w || this.x < 0) this.speedX = -this.speedX;
      if (this.y > h || this.y < 0) this.speedY = -this.speedY;

      // Update positions
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interactive push/pull effect
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = dx / distance;
          let directionY = dy / distance;
          
          // Gently attract to cursor to simulate neural pull
          this.x += directionX * force * 0.5;
          this.y += directionY * force * 0.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      // Cyan nodes, purple nodes, or neutral white nodes
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.size > 2.5 ? "rgba(0, 240, 255, 0.7)" : "rgba(189, 0, 255, 0.5)";
      ctx.fill();
    }
  }

  // Populate network
  function init() {
    particlesArray = [];
    let numberOfParticles = Math.floor((w * h) / 16000);
    numberOfParticles = Math.min(130, Math.max(40, numberOfParticles)); // Limit to prevent CPU overload

    for (let i = 0; i < numberOfParticles; i++) {
      let x = Math.random() * w;
      let y = Math.random() * h;
      particlesArray.push(new Particle(x, y));
    }
  }
  init();

  // Connect close nodes
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          opacityValue = 1 - (distance / 110);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue * 0.12})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
      
      // Connect to mouse pointer
      if (mouse.x != null && mouse.y != null) {
        let dx = particlesArray[a].x - mouse.x;
        let dy = particlesArray[a].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          opacityValue = 1 - (distance / mouse.radius);
          ctx.strokeStyle = `rgba(189, 0, 255, ${opacityValue * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Loop
  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }
  animate();

  // Reinitialize on resize
  window.addEventListener("resize", function() {
    init();
  });
})();
