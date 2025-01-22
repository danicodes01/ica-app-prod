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
    stationType?: string;
  }
  
  export class StationBackgroundRenderer {
    private static instance: StationBackgroundRenderer;
    private stars: Star[] = [];
    private lastTime: number = 0;
  
    private constructor() {
      this.generateStars(150); // Fewer stars for cleaner look
    }
  
    static getInstance(): StationBackgroundRenderer {
      if (!StationBackgroundRenderer.instance) {
        StationBackgroundRenderer.instance = new StationBackgroundRenderer();
      }
      return StationBackgroundRenderer.instance;
    }
  
    private generateStars(count: number): void {
      this.stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2.5 + 1.5, // Slightly larger stars
        alpha: Math.random() * 0.6 + 0.4, // Higher base alpha for more visibility
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.01 + 0.005 // Slower twinkling
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
      
      // Create a more defined star with a sharp center
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      const starColor = `rgba(255, 255, 255, ${alpha})`;
      const coreColor = `rgba(255, 255, 255, ${alpha * 1.5})`; // Brighter core
      
      gradient.addColorStop(0, coreColor);
      gradient.addColorStop(0.4, starColor);
      gradient.addColorStop(1, 'transparent');
      
      // Add subtle glow
      ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
      ctx.shadowBlur = size * 0.8;
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a small central point for extra definition
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.8})`;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  
    private updateStars(deltaTime: number): void {
      this.stars.forEach(star => {
        star.phase += star.twinkleSpeed * deltaTime;
        // Reduced twinkle range for more subtle effect
        const twinkle = Math.sin(star.phase) * 0.15;
        star.alpha = Math.max(0.4, Math.min(0.9, star.alpha + twinkle));
      });
    }
  
    render(options: BackgroundRenderOptions): void {
      const { ctx, canvas } = options;
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
  
      // Create a darker gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0A0F1F'); // Darker blue-black at top
      gradient.addColorStop(1, '#0D1117'); // Slightly lighter at bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Add a subtle overlay for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
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