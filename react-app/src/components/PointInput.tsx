import type { Point, TriangleData } from "./InputPage";

// Reusable component for point input
interface PointInputProps {
    pointIndex: keyof TriangleData;
    pointData: Point;
    onPointChange: (pointIndex: keyof TriangleData, coord: 'x' | 'y', value: string) => void;
}

export const PointInput: React.FC<PointInputProps> = ({ pointIndex, pointData, onPointChange }) => {
    return (
      <div className="point-input">
        <h3>Point {pointIndex.replace('point', '')}</h3>
        <div className="coordinate-inputs">
          <label>
            X: <input
              type="number"
              value={pointData.x}
              onChange={(e) => onPointChange(pointIndex, 'x', e.target.value)}
              step="any"
            />
          </label>
          <label>
            Y: <input
              type="number"
              value={pointData.y}
              onChange={(e) => onPointChange(pointIndex, 'y', e.target.value)}
              step="any"
            />
          </label>
        </div>
      </div>
    );
};