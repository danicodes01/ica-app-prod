import { 
    RenderOptions, 
    StarOptions, 
    PlayerOptions,
    Planet,
    GameColors,
    Position
  } from '@/types/game/canvas';
  import { PlanetRenderer } from './planetRenderer';
  
  export class GameRenderer {
    private static instance: GameRenderer;
    private animationFrameId: number | null = null;
    private stars: Array<{ x: number; y: number; size: number; alpha: number }> = [];
    private hoveredPlanet: string | null = null;
    private lastTime: number = 0;
    private starTwinkleSpeed: number = 0.002;
  
    private constructor() {
      this.generateStars(200); 
    }
  
    static getInstance(): GameRenderer {
      if (!GameRenderer.instance) {
        GameRenderer.instance = new GameRenderer();
      }
      return GameRenderer.instance;
    }
  
    setHoveredPlanet(planetId: string | null): void {
      this.hoveredPlanet = planetId;
    }
  
    private generateStars(count: number): void {
      this.stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3
      }));
    }
  
    private drawStar({ ctx, x, y, size, alpha }: StarOptions): void {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      const starColor = `rgba(235, 235, 245, ${alpha})`;
      gradient.addColorStop(0, starColor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  
    private drawPlayer({ ctx, x, y, colors, isMoving }: PlayerOptions): void {
      ctx.save();
      
      // Glow effect
      ctx.shadowColor = colors.accent;
      ctx.shadowBlur = 15;
  
      // Draw the player ship
      ctx.font = '30px Arial';
      ctx.fillStyle = colors.foreground;
      ctx.fillText('🚀', x - 15, y + 10);
  
      // Engine trail
      if (isMoving) {
        const trailGradient = ctx.createRadialGradient(x, y + 15, 0, x, y + 15, 25);
        trailGradient.addColorStop(0, colors.glow);
        trailGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = trailGradient;
        ctx.beginPath();
        ctx.arc(x, y + 15, 25, 0, Math.PI * 2);
        ctx.fill();
      }
  
      ctx.restore();
    }
  
    private updateStars(deltaTime: number): void {
      this.stars.forEach(star => {
        // Create a subtle twinkling effect
        star.alpha += Math.sin(this.lastTime * this.starTwinkleSpeed) * 0.01 * deltaTime;
        star.alpha = Math.max(0.1, Math.min(0.8, star.alpha));
      });
    }
  
    private drawStarfield(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ): void {
      this.stars.forEach(star => {
        this.drawStar({
          ctx,
          x: star.x * width,
          y: star.y * height,
          size: star.size,
          alpha: star.alpha
        });
      });
    }
  
    private drawPlanets(
      ctx: CanvasRenderingContext2D, 
      planets: Planet[], 
      colors: GameColors
    ): void {
      // Sort planets by y position for proper layering
      const sortedPlanets = [...planets].sort((a, b) => a.position.y - b.position.y);
  
      sortedPlanets.forEach(planet => {
        const { x, y, radius } = planet.position;
        const isHovered = this.hoveredPlanet === planet.id;
  
        PlanetRenderer.drawPlanet(planet.type, {
          ctx,
          x,
          y,
          radius,
          isUnlocked: planet.isUnlocked,
          isHovered,
          accentColor: colors.accent
        });

        this.drawPlanetLabel(ctx, planet, colors);
  
        // Draw additional info if planet is hovered
        if (isHovered) {
          this.drawPlanetInfo(ctx, planet, colors);
        }
      });
    }

    private drawPlanetLabel(
      ctx: CanvasRenderingContext2D,
      planet: Planet,
      colors: GameColors
    ): void {
      const { x, y, radius } = planet.position;
      ctx.save();
    
      // Draw planet name
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = planet.isUnlocked ? colors.foreground : 'rgba(235, 235, 245, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(
        planet.name,
        x,
        y - radius - 20
      );
    
      ctx.restore();
    }
  
    private drawPlanetInfo(
      ctx: CanvasRenderingContext2D,
      planet: Planet,
      colors: GameColors
    ): void {
      const { x, y, radius } = planet.position;
      ctx.save();
    
      // Only show XP requirement if planet is locked
      if (!planet.isUnlocked) {
        ctx.font = '12px "Press Start 2P"';
        ctx.fillStyle = colors.accent;
        ctx.textAlign = 'center';
        ctx.fillText(
          `Required XP: ${planet.requiredXP}`,
          x,
          y + radius + 30
        );
      }
    
      // Planet description
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = colors.foreground;
      const description = planet.description;
      const maxWidth = 200;
      const words = description.split(' ');
      let line = '';
      let lineY = y + radius + (planet.isUnlocked ? 30 : 50);
    
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, x, lineY);
          line = word + ' ';
          lineY += 20;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, x, lineY);
    
      ctx.restore();
    }
  
    render(options: RenderOptions): void {
      const { ctx, canvas, colors, state } = options;
      const { width, height } = canvas;
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
  
      // Clear canvas
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, width, height);
  
      // Update and draw starfield
      this.updateStars(deltaTime);
      this.drawStarfield(ctx, width, height);
  
      // Draw planets
      this.drawPlanets(ctx, state.planets, colors);
  
      // Draw player
      const isMoving = this.isPlayerMoving(state.playerPosition);
      this.drawPlayer({
        ctx,
        x: state.playerPosition.x,
        y: state.playerPosition.y,
        colors,
        isMoving
      });
  
      this.lastTime = currentTime;
    }
  
    private lastPlayerPosition: Position | null = null;
  
    private isPlayerMoving(currentPos: Position): boolean {
      if (!this.lastPlayerPosition) {
        this.lastPlayerPosition = currentPos;
        return false;
      }
  
      const dx = currentPos.x - this.lastPlayerPosition.x;
      const dy = currentPos.y - this.lastPlayerPosition.y;
      const isMoving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
      
      this.lastPlayerPosition = currentPos;
      return isMoving;
    }
  
    startAnimation(options: RenderOptions): void {
      const animate = () => {
        this.render(options);
        this.animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    }
  
    stopAnimation(): void {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  
    // Helper method to check if player is near a planet
    isNearPlanet(
      playerX: number,
      playerY: number,
      planet: Planet,
      threshold = 30
    ): boolean {
      const dx = playerX - planet.position.x;
      const dy = playerY - planet.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < planet.position.radius + threshold;
    }
  }