import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const { feature, value, impact } = payload[0].payload;
  const direction = impact > 0 ? 'Raises risk' : 'Lowers risk';
  const color = impact > 0 ? '#dc3545' : '#198754';
  return (
    <div style={{
      background: '#fff', border: '1px solid #dee2e6',
      borderRadius: 6, padding: '8px 12px', fontSize: 13
    }}>
      <strong>{feature}</strong>
      {value != null && (
        <div className="text-muted">Your value: {value}</div>
      )}
      <div style={{ color, fontWeight: 600 }}>
        {direction} ({impact > 0 ? '+' : ''}{impact.toFixed(3)})
      </div>
    </div>
  );
};

const FeatureChart = ({ features }) => {
  if (!features || features.length === 0) {
    return <p className="text-muted text-center">No explanation data available.</p>;
  }

  // If all impact values are missing (old prediction format), show a notice
  const hasImpact = features.some(f => f.impact != null && f.impact !== 0);
  if (!hasImpact) {
    return (
      <p className="text-muted text-center" style={{ fontSize: 13 }}>
        Detailed explanations are not available for this prediction.<br />
        Run a new assessment to see per-patient impact scores.
      </p>
    );
  }

  // Sort by absolute impact descending, highest at top of chart
  const sorted = [...features]
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .reverse();

  const impacts = sorted.map(f => f.impact);
  const maxAbs = Math.max(...impacts.map(Math.abs), 0.01);
  const domain = [-maxAbs * 1.2, maxAbs * 1.2];

  return (
    <div>
      <div className="d-flex gap-3 mb-2" style={{ fontSize: 12 }}>
        <span>
          <span style={{
            display: 'inline-block', width: 12, height: 12,
            background: '#dc3545', borderRadius: 2, marginRight: 4
          }} />
          Raises your risk
        </span>
        <span>
          <span style={{
            display: 'inline-block', width: 12, height: 12,
            background: '#198754', borderRadius: 2, marginRight: 4
          }} />
          Lowers your risk
        </span>
      </div>
      <div style={{ width: '100%', height: Math.max(200, sorted.length * 48) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={domain}
              tickFormatter={(v) => v.toFixed(2)}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="feature"
              width={115}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#6c757d" strokeWidth={1.5} />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {sorted.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.impact > 0 ? '#dc3545' : '#198754'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeatureChart;
