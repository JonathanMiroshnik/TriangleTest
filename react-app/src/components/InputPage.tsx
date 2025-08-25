import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PointInput } from './PointInput';

// Interface to define the structure of a point
export interface Point {
  x: number;
  y: number;
}

// Interface to define the structure of triangle data
export interface TriangleData {
  point1: Point;
  point2: Point;
  point3: Point;
}

const InputPage = () => {
  // State to store the three points of the triangle
  const [triangleData, setTriangleData] = useState<TriangleData>({
    point1: { x: 0, y: 0 },
    point2: { x: 0, y: 0 },
    point3: { x: 0, y: 0 }
  });

  // Hook for navigation between pages
  const navigate = useNavigate();

  // Function to handle input changes for any point
  const handlePointChange = (pointIndex: keyof TriangleData, coord: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    setTriangleData(prev => ({
      ...prev,
      [pointIndex]: {
        ...prev[pointIndex],
        [coord]: numValue
      }
    }));
  };

  // Function to handle form submission and navigate to display page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to display page with triangle data
    navigate('/display', { state: { triangleData } });
  };

  return (
    <div className="input-page">
      <h1>Triangle Input</h1>
      <p>Enter the coordinates for three points to create a triangle</p>
      
      <form onSubmit={handleSubmit}>
        {/* Use the reusable PointInput component for all three points */}
        <PointInput
          pointIndex="point1"
          pointData={triangleData.point1}
          onPointChange={handlePointChange}
        />
        
        <PointInput
          pointIndex="point2"
          pointData={triangleData.point2}
          onPointChange={handlePointChange}
        />
        
        <PointInput
          pointIndex="point3"
          pointData={triangleData.point3}
          onPointChange={handlePointChange}
        />

        {/* Button to show the triangle */}
        <button type="submit" className="show-triangle-btn">
          Show Triangle
        </button>
      </form>
    </div>
  );
};

export default InputPage;
