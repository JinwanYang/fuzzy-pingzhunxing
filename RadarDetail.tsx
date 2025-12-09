import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { PlatformMetric } from '../types';

interface RadarDetailProps {
  platform: PlatformMetric;
}

const RadarDetail: React.FC<RadarDetailProps> = ({ platform }) => {
  const data = [
    { subject: '预测准确率', A: platform.accuracyScore, fullMark: 100 },
    { subject: '群体智慧', A: platform.communityWisdom, fullMark: 100 },
    { subject: '市场传导力', A: platform.marketImpact, fullMark: 100 },
    { subject: '用户匹配度', A: platform.userFit, fullMark: 100 },
    { subject: '综合推荐率', A: platform.matchRate, fullMark: 100 },
  ];

  return (
    <div className="h-[300px] w-full flex flex-col items-center justify-center bg-slate-900 rounded-lg border border-slate-700 p-2">
      <h4 className="text-sm text-gray-400 w-full text-left px-2">平台-股票-用户 适配模型</h4>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={platform.name}
            dataKey="A"
            stroke="#fbbf24"
            strokeWidth={2}
            fill="#fbbf24"
            fillOpacity={0.4}
          />
          <Tooltip 
             contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarDetail;