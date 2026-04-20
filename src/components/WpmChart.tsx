import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import type { HistoryPoint } from '../hooks/useTypingEngine';

interface WpmChartProps {
  data: HistoryPoint[];
}

export const WpmChart = ({ data }: WpmChartProps) => {
  return (
    <div className="wpm-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--sub-color)" opacity={0.2} vertical={false} />
          <XAxis 
            dataKey="second" 
            stroke="var(--sub-color)" 
            tick={{ fill: 'var(--sub-color)' }}
            tickMargin={10}
            minTickGap={20}
          />
          <YAxis 
            stroke="var(--sub-color)" 
            tick={{ fill: 'var(--sub-color)' }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-color)', 
              borderColor: 'var(--sub-color)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono'
            }} 
            itemStyle={{ color: 'var(--text-color)' }}
            labelStyle={{ color: 'var(--sub-color)', marginBottom: '5px' }}
          />
          <Line 
            type="monotone" 
            dataKey="wpm" 
            stroke="var(--main-color)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--bg-color)', stroke: 'var(--main-color)' }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="raw" 
            stroke="var(--sub-color)" 
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
