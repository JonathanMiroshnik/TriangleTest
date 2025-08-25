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
  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 800;

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

  // Function to transform triangle data and calculate angles
  const calculateSvgData = () => {
    // Calculate the bounding box of the triangle to center it
    const minX = Math.min(triangleData.point1.x, triangleData.point2.x, triangleData.point3.x);
    const maxX = Math.max(triangleData.point1.x, triangleData.point2.x, triangleData.point3.x);
    const minY = Math.min(triangleData.point1.y, triangleData.point2.y, triangleData.point3.y);
    const maxY = Math.max(triangleData.point1.y, triangleData.point2.y, triangleData.point3.y);

    // Calculate scale and offset to fit triangle in svgWidth x svgHeight area
    const scale = Math.min(700 / (maxX - minX), 700 / (maxY - minY));
    const offsetX = (svgWidth - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (svgHeight - (maxY - minY) * scale) / 2 - minY * scale;

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

  /**
   * Calculates the SVG path data for an angle arc at a given vertex of a triangle.
   * @param a The first point of the triangle.
   * @param b The second point of the triangle (this will be the vertex where the angle is drawn).
   * @param c The third point of the triangle.
   * @param radius The radius of the angle arc. Defaults to 15.
   * @returns The `d` attribute string for an SVG <path> element representing the angle arc.
   */
  function getAngleArcPath(
    a: Point,
    b: Point, // This is the vertex point
    c: Point,
    radius: number = 50
  ): string {

    // 1. Create vectors from the vertex (point b) to the other two points
    const vector1 = { x: a.x - b.x, y: a.y - b.y };
    const vector2 = { x: c.x - b.x, y: c.y - b.y };

    // 2. Calculate the angles of these vectors using Math.atan2
    const angle1 = Math.atan2(vector1.y, vector1.x);
    const angle2 = Math.atan2(vector2.y, vector2.x);

    // 3. Determine the sweep flag (1 for large arc, 0 for small)
    // We usually want the small arc. This logic checks which angle is larger
    // and sets the flags to sweep between them correctly.
    let startAngle = angle1;
    let endAngle = angle2;

    // Ensure we take the shorter arc around the circle
    if (Math.abs(angle2 - angle1) > Math.PI) {
      if (angle2 > angle1) {
        startAngle += 2 * Math.PI;
      } else {
        endAngle += 2 * Math.PI;
      }
    }

    // 4. Build the SVG path string
    // M = Move to the start point of the arc (vertex + polar coordinates using the first angle)
    // A = Elliptical Arc command: 
    //   radiusX, radiusY, 
    //   x-axis-rotation (0 for a circle), 
    //   large-arc-flag (0 for our small arc), 
    //   sweep-flag (1 to sweep positively/clockwise, needs calculation),
    //   endX, endY
    // The sweep flag is 1 if the arc is being drawn clockwise from start to end, else 0.
    // We calculate it by checking if the end angle is greater than the start angle after our adjustment.
    const sweepFlag = endAngle > startAngle ? 1 : 0;

    const startX = b.x + radius * Math.cos(startAngle);
    const startY = b.y + radius * Math.sin(startAngle);

    const endX = b.x + radius * Math.cos(endAngle);
    const endY = b.y + radius * Math.sin(endAngle);

    // Construct the 'd' attribute
    const d = [
      `M ${startX} ${startY}`, // Move to the start of the arc
      `A ${radius} ${radius} 0 0 ${sweepFlag} ${endX} ${endY}` // Draw the arc to the end point
    ].join(' ');

    return d;
  }

  // Calculate SVG data when component mounts or triangle data changes
  useEffect(() => {
    calculateSvgData();
  }, [triangleData]);

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

          {/* Angle arc for Point 1 (angle between edge p1->p2 and edge p1->p3) */}
          <path
            d={getAngleArcPath(svgData.p1, svgData.p2, svgData.p3)}
            fill="none"
            stroke="#e74c3c"
            strokeWidth="2"
          />

          {/* Angle arc for Point 2 (angle between edge p2->p3 and edge p2->p1) */}
          <path
            d={getAngleArcPath(svgData.p2, svgData.p3, svgData.p1)}
            fill="none"
            stroke="#e74c3c"
            strokeWidth="2"
          />

          {/* Angle arc for Point 3 (angle between edge p3->p1 and edge p3->p2) */}
          <path
            d={getAngleArcPath(svgData.p3, svgData.p1, svgData.p2)}
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
