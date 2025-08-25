import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// Interface to define the structure of a point
interface Point {
  x: number;
  y: number;
}

// Interface to define the structure of triangle data
interface TriangleData {
  point1: Point;
  point2: Point;
  point3: Point;
}

const DisplayPage = () => {
  // Get triangle data from navigation state
  const location = useLocation();
  const triangleData: TriangleData = location.state?.triangleData || {
    point1: { x: 100, y: 100 },
    point2: { x: 300, y: 100 },
    point3: { x: 200, y: 300 }
  };

  // Hook for navigation back to input page
  const navigate = useNavigate();
  
  // Reference to the canvas element for drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to calculate the angle between three points using the law of cosines
  const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
    // Calculate the sides of the triangle using distance formula
    const a = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
    const b = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
    const c = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    
    // Use law of cosines: cos(A) = (b² + c² - a²) / (2bc)
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    
    // Convert to degrees and ensure it's within valid range
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosA)));
    return (angleRad * 180) / Math.PI;
  };

  // Function to draw the triangle and angles on the canvas
  const drawTriangle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to 800x800 as specified
    canvas.width = 800;
    canvas.height = 800;

    // Calculate the bounding box of the triangle to center it
    const minX = Math.min(triangleData.point1.x, triangleData.point2.x, triangleData.point3.x);
    const maxX = Math.max(triangleData.point1.x, triangleData.point2.x, triangleData.point3.x);
    const minY = Math.min(triangleData.point1.y, triangleData.point2.y, triangleData.point3.y);
    const maxY = Math.max(triangleData.point1.y, triangleData.point2.y, triangleData.point3.y);

    // Calculate scale and offset to fit triangle in 800x800 area
    const scale = Math.min(700 / (maxX - minX), 700 / (maxY - minY));
    const offsetX = (800 - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (800 - (maxY - minY) * scale) / 2 - minY * scale;

    // Transform points to fit in canvas
    const transformPoint = (p: Point) => ({
      x: p.x * scale + offsetX,
      y: p.y * scale + offsetY
    });

    const p1 = transformPoint(triangleData.point1);
    const p2 = transformPoint(triangleData.point2);
    const p3 = transformPoint(triangleData.point3);

    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Calculate angles
    const angle1 = calculateAngle(triangleData.point1, triangleData.point2, triangleData.point3);
    const angle2 = calculateAngle(triangleData.point2, triangleData.point3, triangleData.point1);
    const angle3 = calculateAngle(triangleData.point3, triangleData.point1, triangleData.point2);

    // Draw angle arcs
    const drawAngleArc = (center: Point, startAngle: number, endAngle: number, radius: number) => {
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, startAngle, endAngle);
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Calculate angles for drawing arcs (convert to radians)
    const angle1Rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angle2Rad = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    const angle3Rad = Math.atan2(p1.y - p3.y, p1.x - p3.x);

    // Draw angle arcs (small radius)
    const arcRadius = 30;
    drawAngleArc(p1, angle1Rad, angle1Rad + (angle1 * Math.PI) / 180, arcRadius);
    drawAngleArc(p2, angle2Rad, angle2Rad + (angle2 * Math.PI) / 180, arcRadius);
    drawAngleArc(p3, angle3Rad, angle3Rad + (angle3 * Math.PI) / 180, arcRadius);

    // Display angle values
    ctx.fillStyle = '#2c3e50';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    // Position text near each vertex
    ctx.fillText(`${angle1.toFixed(1)}°`, p1.x, p1.y - 20);
    ctx.fillText(`${angle2.toFixed(1)}°`, p2.x, p2.y - 20);
    ctx.fillText(`${angle3.toFixed(1)}°`, p3.x, p3.y - 20);

    // Display total angle (should be 180°)
    ctx.fillText(`Total: ${(angle1 + angle2 + angle3).toFixed(1)}°`, 400, 750);
  };

  // Draw triangle when component mounts or triangle data changes
  useEffect(() => {
    drawTriangle();
  }, [triangleData]);

  return (
    <div className="display-page">
      <h1>Triangle Display</h1>
      <p>Triangle drawn based on your input coordinates</p>
      
      {/* Canvas for drawing the triangle */}
      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          className="triangle-canvas"
          style={{ border: '2px solid #ccc' }}
        />
      </div>

      {/* Button to go back to input page */}
      <button 
        onClick={() => navigate('/')} 
        className="back-btn"
      >
        Back to Input
      </button>
    </div>
  );
};

export default DisplayPage;
