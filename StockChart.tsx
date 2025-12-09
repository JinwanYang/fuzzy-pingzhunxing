import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { KLineData } from '../types';

interface StockChartProps {
  data: KLineData[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full bg-slate-900 rounded-lg p-2 border border-slate-700">
        <h4 className="text-sm text-gray-400 mb-2 px-2">K线走势 / 预测准确度复盘</h4>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            axisLine={{ stroke: '#475569' }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          {/* Mock Candle Stick logic using ErrorBar or custom shapes is complex in Recharts, 
              simulating with Range Bar for body and Line for trend for simplicity in this demo */}
           <Bar dataKey="high" fill="transparent" barSize={1} /> 
           <Bar dataKey="low" fill="transparent" barSize={1} /> 
           {/* We visualize the Close price trend primarily */}
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false}
            name="收盘价"
          />
          {/* Visualizing 'High' relative to close as volatility shadow */}
          <Line 
             type="monotone"
             dataKey="high"
             stroke="#3b82f6"
             strokeWidth={1}
             strokeOpacity={0.3}
             dot={false}
             name="当日最高"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;