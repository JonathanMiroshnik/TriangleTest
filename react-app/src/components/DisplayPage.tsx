import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
  
  // State to store transformed points and calculated angles
  const [svgData, setSvgData] = useState<{
    p1: Point;
    p2: Point;
    p3: Point;
    angle1: number;
    angle2: number;
    angle3: number;
  }>({
    p1: { x: 0, y: 0 },
    p2: { x: 0, y: 0 },
    p3: { x: 0, y: 0 },
    angle1: 0,
    angle2: 0,
    angle3: 0
  });

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

  // Function to calculate SVG path for angle arcs
  const createArcPath = (center: Point, startAngle: number, endAngle: number, radius: number, clockwise: boolean = true): string => {
    // Convert angles to radians
    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;
    
    // Calculate start and end points of the arc
    const startX = center.x + radius * Math.cos(startRad);
    const startY = center.y + radius * Math.sin(startRad);
    const endX = center.x + radius * Math.cos(endRad);
    const endY = center.y + radius * Math.sin(endRad);
    
    // Determine if the arc should be drawn clockwise or counterclockwise
    const largeArcFlag = Math.abs(endRad - startRad) > Math.PI ? 1 : 0;
    
    // Create SVG arc path - use clockwise parameter to determine sweep flag
    const sweepFlag = clockwise ? 1 : 0;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
  };

  // Function to calculate the correct starting angle for drawing an arc
  const calculateArcStartAngle = (center: Point, p1: Point): number => {
    // Calculate the angle from center to the first point
    return Math.atan2(p1.y - center.y, p1.x - center.x) * 180 / Math.PI;
  };

  // Function to calculate the correct ending angle for drawing an arc
  const calculateArcEndAngle = (center: Point, p1: Point, angle: number): number => {
    // Start from the first point and rotate by the calculated angle
    const startAngle = Math.atan2(p1.y - center.y, p1.x - center.x) * 180 / Math.PI;
    return startAngle + angle;
  };

  // Function to determine if we should draw the arc clockwise or counterclockwise
  const shouldDrawClockwise = (p1: Point, p2: Point, p3: Point): boolean => {
    // Calculate the cross product to determine the orientation
    // If positive, the triangle is counterclockwise; if negative, it's clockwise
    const crossProduct = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
    
    // For a triangle, we want the arc to be drawn towards the inside
    // If the triangle is counterclockwise, we draw clockwise (towards inside)
    // If the triangle is clockwise, we draw counterclockwise (towards inside)
    return crossProduct > 0;
  };

  // Function to transform triangle data and calculate angles
  const calculateSvgData = () => {
    // Calculate the bounding box of the triangle to center it
    const minX = Math.min(triangleData.point1.x, triangleData.point2.x, triangleData.point3.x);
    const maxX = Math.max(triangleData.point1.x, triangleData.point2.x, triangleData.point3.x);
    const minY = Math.min(triangleData.point1.y, triangleData.point2.y, triangleData.point3.y);
    const maxY = Math.max(triangleData.point1.y, triangleData.point2.y, triangleData.point3.y);

    // Calculate scale and offset to fit triangle in 800x800 area
    const scale = Math.min(700 / (maxX - minX), 700 / (maxY - minY));
    const offsetX = (800 - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (800 - (maxY - minY) * scale) / 2 - minY * scale;

    // Transform points to fit in SVG
    const transformPoint = (p: Point) => ({
      x: p.x * scale + offsetX,
      y: p.y * scale + offsetY
    });

    const p1 = transformPoint(triangleData.point1);
    const p2 = transformPoint(triangleData.point2);
    const p3 = transformPoint(triangleData.point3);

    // Calculate angles
    const angle1 = calculateAngle(triangleData.point1, triangleData.point2, triangleData.point3);
    const angle2 = calculateAngle(triangleData.point2, triangleData.point3, triangleData.point1);
    const angle3 = calculateAngle(triangleData.point3, triangleData.point1, triangleData.point2);

    setSvgData({ p1, p2, p3, angle1, angle2, angle3 });
  };

  // Calculate SVG data when component mounts or triangle data changes
  useEffect(() => {
    calculateSvgData();
  }, [triangleData]);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 800;

  return (
    <div className="display-page">
      <h1>Triangle Display</h1>
      <p>Triangle drawn based on your input coordinates</p>
      
      {/* SVG container for drawing the triangle */}
      <div className="canvas-container">
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          className="triangle-svg"
          style={{ border: '2px solid #ccc', borderRadius: '10px' }}
        >
          {/* Triangle outline */}
          <polygon
            points={`${svgData.p1.x},${svgData.p1.y} ${svgData.p2.x},${svgData.p2.y} ${svgData.p3.x},${svgData.p3.y}`}
            fill="none"
            stroke="#333"
            strokeWidth="3"
          />

          {/* Angle arc for Point 1 */}
          <path
            d={createArcPath(
              svgData.p1,
              calculateArcStartAngle(svgData.p1, svgData.p2),
              calculateArcEndAngle(svgData.p1, svgData.p2, svgData.angle1),
              30,
              shouldDrawClockwise(svgData.p1, svgData.p2, svgData.p3)
            )}
            fill="none"
            stroke="#e74c3c"
            strokeWidth="2"
          />

          {/* Angle arc for Point 2 */}
          <path
            d={createArcPath(
              svgData.p2,
              calculateArcStartAngle(svgData.p2, svgData.p3),
              calculateArcEndAngle(svgData.p2, svgData.p3, svgData.angle2),
              30,
              shouldDrawClockwise(svgData.p2, svgData.p3, svgData.p1)
            )}
            fill="none"
            stroke="#e74c3c"
            strokeWidth="2"
          />

          {/* Angle arc for Point 3 */}
          <path
            d={createArcPath(
              svgData.p3,
              calculateArcStartAngle(svgData.p3, svgData.p1),
              calculateArcEndAngle(svgData.p3, svgData.p1, svgData.angle3),
              30,
              shouldDrawClockwise(svgData.p3, svgData.p1, svgData.p2)
            )}
            fill="none"
            stroke="#e74c3c"
            strokeWidth="2"
          />

          {/* Angle value labels */}
          <text
            x={svgData.p1.x}
            y={svgData.p1.y - 20}
            textAnchor="middle"
            fill="#2c3e50"
            fontSize="16"
            fontFamily="Arial"
          >
            {svgData.angle1.toFixed(1)}°
          </text>

          <text
            x={svgData.p2.x}
            y={svgData.p2.y - 20}
            textAnchor="middle"
            fill="#2c3e50"
            fontSize="16"
            fontFamily="Arial"
          >
            {svgData.angle2.toFixed(1)}°
          </text>

          <text
            x={svgData.p3.x}
            y={svgData.p3.y - 20}
            textAnchor="middle"
            fill="#2c3e50"
            fontSize="16"
            fontFamily="Arial"
          >
            {svgData.angle3.toFixed(1)}°
          </text>
        </svg>
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
