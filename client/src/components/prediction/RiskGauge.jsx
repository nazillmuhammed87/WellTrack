import React from 'react';
import { RISK_LEVELS } from '../../utils/constants';

const RiskGauge = ({ probability, riskLevel }) => {
  const percentage = Math.round((probability || 0) * 100);
  const riskConfig = RISK_LEVELS[riskLevel] || RISK_LEVELS.Low;
  const color = riskConfig.color;

  // SVG semi-circular gauge
  const radius = 80;
  const strokeWidth = 16;
  const cx = 100;
  const cy = 100;

  // Semi-circle arc (from 180 to 0 degrees, i.e., left to right across the top)
  const circumference = Math.PI * radius;
  const filled = (percentage / 100) * circumference;
  const remaining = circumference - filled;

  // Arc path for background and fill
  const arcStartX = cx - radius;
  const arcStartY = cy;
  const arcEndX = cx + radius;
  const arcEndY = cy;

  const backgroundPath = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 0 1 ${arcEndX} ${arcEndY}`;

  return (
    <div className="text-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d={backgroundPath}
          fill="none"
          stroke="#e9ecef"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${remaining}`}
        />
        {/* Percentage text */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill={color}
        >
          {percentage}%
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="13"
          fill="#6c757d"
        >
          {riskConfig.label}
        </text>
      </svg>
    </div>
  );
};

export default RiskGauge;
