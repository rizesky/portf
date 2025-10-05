class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById('bg-animation');
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.meteors = [];
    this.animationId = null;
    this.time = 0;
    
    this.init();
  }

  init() {
    this.resize();
    this.createStars();
    this.createMeteors();
    this.animate();
    
    window.addEventListener('resize', () => this.handleResize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createStars() {
    this.stars = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.05 + 0.03,
        brightness: Math.random() * 0.8 + 0.2,
        trail: [],
        maxTrailLength: Math.floor(Math.random() * 8) + 3
      });
    }
  }

  createMeteors() {
    this.meteors = [];
    for (let i = 0; i < 3; i++) {
      this.meteors.push({
        x: Math.random() * this.canvas.width,
        y: -50,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 3 + 2,
        size: Math.random() * 3 + 2,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        active: false,
        trail: []
      });
    }
  }

  animate() {
    this.time++;
    
    // Enhanced gradient background
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
    );
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stars with trails and enhanced effects
    this.stars.forEach(star => {
      star.trail.push({ x: star.x, y: star.y, alpha: 1 });
      
      if (star.trail.length > star.maxTrailLength) {
        star.trail.shift();
      }
      
      star.trail.forEach((point, index) => {
        const trailAlpha = (index / star.trail.length) * 0.3;
        this.ctx.fillStyle = `rgba(157, 78, 221, ${trailAlpha})`;
        this.ctx.fillRect(point.x, point.y, star.size * 0.5, star.size * 0.5);
      });
      
      const twinkleAlpha = (Math.sin(star.twinkle) + 1) / 2;
      const alpha = twinkleAlpha * star.brightness * 0.8 + 0.2;
      this.ctx.fillStyle = `rgba(157, 78, 221, ${alpha})`;
      
      this.ctx.fillRect(star.x - 1, star.y, 3, 1);
      this.ctx.fillRect(star.x, star.y - 1, 1, 3);
      
      if (alpha > 0.7) {
        this.ctx.fillStyle = `rgba(157, 78, 221, ${alpha * 0.3})`;
        this.ctx.fillRect(star.x - 2, star.y - 2, 5, 5);
      }
      
      star.y += star.speedY;
      star.x += Math.sin(this.time * 0.001 + star.twinkle) * 0.1;
      star.twinkle += star.twinkleSpeed;
      
      if (star.y > this.canvas.height + 10) {
        star.y = -star.size;
        star.x = Math.random() * this.canvas.width;
        star.trail = [];
      }
    });
    
    this.meteors.forEach(meteor => {
      if (!meteor.active && Math.random() < 0.002) {
        meteor.active = true;
        meteor.x = Math.random() * this.canvas.width;
        meteor.y = -50;
        meteor.life = 0;
        meteor.trail = [];
      }
      
      if (meteor.active) {
        meteor.trail.push({ x: meteor.x, y: meteor.y });
        if (meteor.trail.length > 15) {
          meteor.trail.shift();
        }
        
        meteor.trail.forEach((point, index) => {
          const trailAlpha = (index / meteor.trail.length) * 0.6;
          this.ctx.fillStyle = `rgba(157, 78, 221, ${trailAlpha})`;
          this.ctx.fillRect(point.x, point.y, meteor.size * 0.8, meteor.size * 0.8);
        });
        
        this.ctx.fillStyle = `rgba(157, 78, 221, 0.9)`;
        this.ctx.fillRect(meteor.x, meteor.y, meteor.size, meteor.size);
        
        meteor.x += meteor.speedX;
        meteor.y += meteor.speedY;
        meteor.life++;
        
        if (meteor.y > this.canvas.height + 50 || meteor.life > meteor.maxLife) {
          meteor.active = false;
        }
      }
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  handleResize() {
    this.resize();
    this.createStars();
    this.createMeteors();
  }
}
