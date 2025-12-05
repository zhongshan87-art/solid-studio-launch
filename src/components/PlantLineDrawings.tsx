import { useEffect, useRef } from 'react';

interface PlantLineDrawingsProps {
  containerHeight: number;
}

const PlantLineDrawings = ({ containerHeight }: PlantLineDrawingsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = containerHeight * dpr;
    ctx.scale(dpr, dpr);

    // Generate random plant positions
    const plants: {
      x: number;
      baseY: number;
      stems: { angle: number; length: number; curve: number; leafCount: number }[];
      phase: number;
      swaySpeed: number;
    }[] = [];

    // Create clusters of plants in whitespace areas
    const plantCount = Math.floor((window.innerWidth * containerHeight) / 80000);
    
    for (let i = 0; i < plantCount; i++) {
      const x = Math.random() * window.innerWidth;
      const baseY = Math.random() * containerHeight;
      
      const stemCount = Math.floor(Math.random() * 5) + 3;
      const stems = [];
      
      for (let j = 0; j < stemCount; j++) {
        stems.push({
          angle: (Math.random() - 0.5) * 0.6 - Math.PI / 2,
          length: Math.random() * 80 + 40,
          curve: (Math.random() - 0.5) * 0.3,
          leafCount: Math.floor(Math.random() * 4) + 1
        });
      }
      
      plants.push({
        x,
        baseY,
        stems,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.5 + 0.3
      });
    }

    const drawPlant = (
      plant: typeof plants[0],
      time: number
    ) => {
      const sway = Math.sin(time * plant.swaySpeed + plant.phase) * 0.05;
      
      plant.stems.forEach((stem) => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 0.5;
        
        const startX = plant.x;
        const startY = plant.baseY;
        
        // Draw curved stem using quadratic bezier
        const endAngle = stem.angle + sway;
        const endX = startX + Math.cos(endAngle) * stem.length;
        const endY = startY + Math.sin(endAngle) * stem.length;
        
        const ctrlX = startX + Math.cos(endAngle + stem.curve) * stem.length * 0.5;
        const ctrlY = startY + Math.sin(endAngle + stem.curve) * stem.length * 0.5;
        
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
        ctx.stroke();
        
        // Draw delicate leaves along stem
        for (let l = 0; l < stem.leafCount; l++) {
          const t = (l + 1) / (stem.leafCount + 1);
          const leafX = startX + (ctrlX - startX) * t * 2 * (1 - t) + (endX - startX) * t * t;
          const leafY = startY + (ctrlY - startY) * t * 2 * (1 - t) + (endY - startY) * t * t;
          
          const leafAngle = endAngle + (Math.random() - 0.5) * 0.5 + sway;
          const leafLength = 8 + Math.random() * 12;
          
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
          ctx.lineWidth = 0.3;
          
          // Leaf as thin curved line
          const leafEndX = leafX + Math.cos(leafAngle + Math.PI / 4) * leafLength;
          const leafEndY = leafY + Math.sin(leafAngle + Math.PI / 4) * leafLength;
          
          ctx.moveTo(leafX, leafY);
          ctx.quadraticCurveTo(
            leafX + Math.cos(leafAngle) * leafLength * 0.5,
            leafY + Math.sin(leafAngle) * leafLength * 0.5,
            leafEndX,
            leafEndY
          );
          ctx.stroke();
        }
      });
      
      // Draw grass-like fine lines at base
      const grassCount = Math.floor(Math.random() * 6) + 3;
      for (let g = 0; g < grassCount; g++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 0.3;
        
        const grassAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8 + sway * 1.5;
        const grassLength = 15 + Math.random() * 25;
        const grassX = plant.x + (Math.random() - 0.5) * 20;
        
        ctx.moveTo(grassX, plant.baseY);
        ctx.quadraticCurveTo(
          grassX + Math.cos(grassAngle) * grassLength * 0.3,
          plant.baseY + Math.sin(grassAngle) * grassLength * 0.6,
          grassX + Math.cos(grassAngle) * grassLength,
          plant.baseY + Math.sin(grassAngle) * grassLength
        );
        ctx.stroke();
      }
    };

    let startTime = performance.now();

    const animate = () => {
      const time = (performance.now() - startTime) / 1000;
      
      ctx.clearRect(0, 0, window.innerWidth, containerHeight);
      
      plants.forEach((plant) => {
        drawPlant(plant, time);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: containerHeight,
      }}
    />
  );
};

export default PlantLineDrawings;
