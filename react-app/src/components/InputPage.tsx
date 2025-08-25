import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        {/* Input fields for Point 1 */}
        <div className="point-input">
          <h3>Point 1</h3>
          <div className="coordinate-inputs">
            <label>
              X: <input
                type="number"
                value={triangleData.point1.x}
                onChange={(e) => handlePointChange('point1', 'x', e.target.value)}
                step="any"
              />
            </label>
            <label>
              Y: <input
                type="number"
                value={triangleData.point1.y}
                onChange={(e) => handlePointChange('point1', 'y', e.target.value)}
                step="any"
              />
            </label>
          </div>
        </div>

        {/* Input fields for Point 2 */}
        <div className="point-input">
          <h3>Point 2</h3>
          <div className="coordinate-inputs">
            <label>
              X: <input
                type="number"
                value={triangleData.point2.x}
                onChange={(e) => handlePointChange('point2', 'x', e.target.value)}
                step="any"
              />
            </label>
            <label>
              Y: <input
                type="number"
                value={triangleData.point2.y}
                onChange={(e) => handlePointChange('point2', 'y', e.target.value)}
                step="any"
              />
            </label>
          </div>
        </div>

        {/* Input fields for Point 3 */}
        <div className="point-input">
          <h3>Point 3</h3>
          <div className="coordinate-inputs">
            <label>
              X: <input
                type="number"
                value={triangleData.point3.x}
                onChange={(e) => handlePointChange('point3', 'x', e.target.value)}
                step="any"
              />
            </label>
            <label>
              Y: <input
                type="number"
                value={triangleData.point3.y}
                onChange={(e) => handlePointChange('point3', 'y', e.target.value)}
                step="any"
              />
            </label>
          </div>
        </div>

        {/* Button to show the triangle */}
        <button type="submit" className="show-triangle-btn">
          Show Triangle
        </button>
      </form>
    </div>
  );
};

export default InputPage;
