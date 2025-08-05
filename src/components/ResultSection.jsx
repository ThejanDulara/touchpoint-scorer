import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

function ResultSection({ scores }) {
  const sorted = Object.entries(scores.results)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
  const chartHeight = sorted.length * 40; // ~40px per touchpoint

  return (
    <div className="results-container">
      <h2 className="results-title">
        <span className="chart-icon">📊</span>
        Campaign Touchpoint Scores: <span className="campaign-name">{scores.campaignName || "Media Campaign"}</span>
      </h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={sorted}
            margin={{ top: 20, right: 40, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              tick={{ fill: '#4a5568' }}
              axisLine={{ stroke: '#cbd5e0' }}
              tickLine={{ stroke: '#cbd5e0' }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={200}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  fontSize={14}
                  fill="#4a5568"
                  fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                  textAnchor="end"
                >
                  {payload.value}
                </text>
              )}
              axisLine={{ stroke: '#cbd5e0' }}
              tickLine={{ stroke: '#cbd5e0' }}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const { name, value } = payload[0].payload;

                return (
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    color: '#4a5568',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <div>Touchpoint: {name}</div>
                    <div>Score: {value}%</div>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="value"
              fill="#4c51bf"
              radius={[0, 4, 4, 0]}
            >
              <LabelList
                dataKey="value"
                position="right"
                fill="#4a5568"
                formatter={(value) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .results-container {
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin: 2rem auto 0;
          width: 100%;
          max-width: 1200px;
          box-sizing: border-box;
        }


        .results-title {
          text-align: center;
          color: #2d3748;
          margin-bottom: 2rem;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .chart-icon {
          font-size: 1.5rem;
        }

        .campaign-name {
          color: #4c51bf;
          font-weight: 600;
        }

        .chart-container {
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .results-container {
            padding: 2.5rem;
          }

          .results-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ResultSection;