interface Star {
    x: number;
    y: number;
    size: number;
    alpha: number;
    phase: number;
    twinkleSpeed: number;
  }
  
  interface BackgroundRenderOptions {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    planetType?: string;
  }
  
  export class BackgroundRenderer {
    private static instance: BackgroundRenderer;
    private stars: Star[] = [];
    private lastTime: number = 0;
  
    private constructor() {
      this.generateStars(200);
    }
  
    static getInstance(): BackgroundRenderer {
      if (!BackgroundRenderer.instance) {
        BackgroundRenderer.instance = new BackgroundRenderer();
      }
      return BackgroundRenderer.instance;
    }
  
    private generateStars(count: number): void {
      this.stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      }));
    }
  
    private drawStar(
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      size: number, 
      alpha: number
    ): void {
      ctx.save();
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      const starColor = `rgba(235, 235, 245, ${alpha})`;
      const coreColor = `rgba(255, 255, 255, ${alpha * 1.2})`; // Brighter core
      
      gradient.addColorStop(0, coreColor);
      gradient.addColorStop(0.5, starColor);
      gradient.addColorStop(1, 'transparent');
      
      // Add slight glow
      ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
      ctx.shadowBlur = size * 0.5;
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  
    private updateStars(deltaTime: number): void {
      this.stars.forEach(star => {
        star.phase += star.twinkleSpeed * deltaTime;
        const twinkle = Math.sin(star.phase) * 0.3;
        star.alpha = Math.max(0.2, Math.min(0.8, star.alpha + twinkle));
      });
    }
  
    render(options: BackgroundRenderOptions): void {
      const { ctx, canvas } = options;
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
  
      // Clear canvas with a slight gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0F172A'); // Dark blue
      gradient.addColorStop(1, '#1E1B4B'); // Darker indigo
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Update and draw stars
      this.updateStars(deltaTime);
      this.stars.forEach(star => {
        this.drawStar(
          ctx,
          star.x * canvas.width,
          star.y * canvas.height,
          star.size,
          star.alpha
        );
      });
  
      this.lastTime = currentTime;
    }
  }