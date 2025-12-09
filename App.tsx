import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Shield, BarChart2, ArrowRight, User, CheckCircle, Info, ExternalLink, Activity, Zap } from 'lucide-react';

// 先定义所有类型（解决“找不到类型声明”报错）
export type AppView = 'LOGIN' | 'PROFILE' | 'DASHBOARD' | 'PLATFORM_DETAIL';
export interface UserProfile {
  name: string;
  capital: number;
  riskTolerance: number;
  experience: number;
}
export interface KLineData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
}
export interface PlatformMetric {
  id: string;
  name: string;
  matchRate: number;
  accuracyScore: number;
  communityWisdom: number;
  userFit: number;
  recentSignal: 'Buy' | 'Sell' | 'Hold';
  description: string;
}
export interface GroundingUrl {
  uri: string;
  title: string;
}
export interface StockData {
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
  riskReport: string;
  recentSituation: string;
  generatedImage?: string;
  platforms: PlatformMetric[];
  groundingUrls: GroundingUrl[];
}

// 模拟geminiService（先避免依赖报错，后续可替换为真实接口）
export const analyzeStockWithSearch = async (query: string, profile: UserProfile): Promise<StockData | null> => {
  // 模拟返回数据（保留原有逻辑）
  return {
    name: query || '贵州茅台',
    symbol: '600519',
    price: 1800 + Math.random() * 100,
    changePercent: (Math.random() - 0.5) * 5,
    riskReport: '当前股价处于合理估值区间，短期受市场情绪影响有波动风险，长期基本面稳健。',
    recentSituation: '近期白酒板块整体回暖，龙头企业批价企稳，经销商库存周转效率提升。',
    platforms: [
      {
        id: '1',
        name: '雪球',
        matchRate: 89,
        accuracyScore: 85,
        communityWisdom: 92,
        userFit: 88,
        recentSignal: 'Buy',
        description: '雪球平台用户以价值投资者为主，对该股票的长期逻辑分析较为深入，与您的风险偏好高度匹配。'
      },
      {
        id: '2',
        name: '东方财富',
        matchRate: 78,
        accuracyScore: 76,
        communityWisdom: 80,
        userFit: 75,
        recentSignal: 'Hold',
        description: '东方财富平台散户参与度高，短期情绪波动较大，但整体对该股票的共识偏乐观。'
      }
    ],
    groundingUrls: [
      { uri: 'https://example.com/1', title: '茅台2024年报解读' },
      { uri: 'https://example.com/2', title: '白酒行业Q3数据分析' }
    ]
  };
};

// Mock K-line data generator
const generateSimulatedKLine = (days: number, currentPrice: number, trend: 'up' | 'down' | 'flat'): KLineData[] => {
  const data: KLineData[] = [];
  let price = currentPrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    let bias = 0;
    if (trend === 'up') bias = -0.2;
    if (trend === 'down') bias = 0.2;
    
    const volatility = price * 0.02;
    const change = (Math.random() - 0.5 + bias) * volatility;
    
    const close = price;
    const open = price - change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.unshift({
      date: date.toISOString().split('T')[0].slice(5),
      open,
      close,
      high,
      low
    });

    price = open;
  }
  return data;
};

// 简化版StockChart组件（先解决依赖报错，后续可替换为真实图表）
const StockChart = ({ data }: { data: KLineData[] }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h4 style={{ color: '#e2e8f0', margin: '0 0 15px', fontSize: '14px' }}>近30天模拟K线</h4>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'end',
        height: '200px',
        borderBottom: '1px solid #334155',
        paddingBottom: '10px'
      }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ 
            width: '8px',
            backgroundColor: item.close >= item.open ? '#ef4444' : '#22c55e',
            height: `${Math.max(10, (item.high - item.low) / 2)}px`,
            margin: '0 1px',
            alignSelf: 'end'
          }}>
            <div style={{ 
              position: 'relative',
              top: `${(item.close - item.low) / (item.high - item.low) * 100}%`,
              width: '100%',
              height: '2px',
              backgroundColor: '#fff'
            }}></div>
          </div>
        ))}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '5px',
        fontSize: '10px',
        color: '#94a3b8'
      }}>
        {data.slice(0, 10).map((item, idx) => (
          <div key={idx}>{item.date}</div>
        ))}
      </div>
    </div>
  );
};

// 简化版RadarDetail组件
const RadarDetail = ({ platform }: { platform: PlatformMetric }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h4 style={{ color: '#e2e8f0', margin: '0 0 15px', fontSize: '14px' }}>平台维度分析</h4>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 5px' }}>准确率</p>
          <p style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{platform.accuracyScore}%</p>
        </div>
        <div style={{ 
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 5px' }}>适配度</p>
          <p style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{platform.userFit}%</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('LOGIN');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Investor',
    capital: 1,
    riskTolerance: 1,
    experience: 3
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformMetric | null>(null);
  const [kLineData, setKLineData] = useState<KLineData[]>([]);

  // Handlers
  const handleLogin = () => setView('PROFILE');
  
  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setView('DASHBOARD');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setStockData(null);
    
    const data = await analyzeStockWithSearch(searchQuery.trim(), userProfile);
    
    if (data) {
        setStockData(data);
        const trend = data.changePercent > 0.5 ? 'up' : data.changePercent < -0.5 ? 'down' : 'flat';
        setKLineData(generateSimulatedKLine(30, data.price, trend));
    } else {
        alert("抱歉，暂时无法获取该股票数据，请检查拼写或稍后重试。");
    }

    setIsLoading(false);
  };

  const handlePlatformClick = (platform: PlatformMetric) => {
    setSelectedPlatform(platform);
    setView('PLATFORM_DETAIL');
  };

  // --- Views ---
  const LoginView = () => (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative', 
      overflow: 'hidden', 
      backgroundColor: '#0f172a'
    }}>
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'url(https://picsum.photos/1920/1080?blur=4)',
        backgroundSize: 'cover', 
        opacity: 0.1, 
        zIndex: 0
      }}></div>
      <div style={{ 
        zIndex: 10, 
        textAlign: 'center', 
        margin: '0 4px',
        padding: '40px',
        borderRadius: '24px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(30, 64, 175, 0.1), 0 8px 10px -6px rgba(30, 64, 175, 0.1)',
        border: '1px solid #334155',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
           <div style={{ 
             background: 'linear-gradient(to right top, #3b82f6, #6366f1)',
             padding: '20px',
             borderRadius: '16px',
             boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
           }}>
             <TrendingUp size={56} style={{ color: 'white' }} />
           </div>
        </div>
        <div>
            <h1 style={{ 
              fontSize: '40px', 
              fontWeight: '800', 
              background: 'linear-gradient(to right, #3b82f6, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
            评准星
            </h1>
            <p style={{ 
              color: 'rgba(191, 219, 254, 0.6)', 
              marginTop: '8px', 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>Ping Zhuan Xing</p>
        </div>
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '16px', 
          fontWeight: '300', 
          lineHeight: '1.5',
          marginTop: '16px'
        }}>
          智能股评量化优选系统<br/>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>基于真实市场情绪的大数据决策引擎</span>
        </p>
        <button 
          onClick={handleLogin}
          style={{ 
            width: '100%',
            background: 'linear-gradient(to right, #3b82f6, #6366f1)',
            color: 'white',
            fontWeight: 'bold',
            padding: '16px 24px',
            borderRadius: '12px',
            border: 'none',
            marginTop: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #4f46e5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 14px 20px -3px rgba(59, 130, 246, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #3b82f6, #6366f1)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.25)';
          }}
        >
          立即开启 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const ProfileView = () => {
      const [localProfile, setLocalProfile] = useState(userProfile);
      
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#020617', 
          padding: '16px',
          position: 'relative'
        }}>
          {/* Background Grid */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.2,
            pointerEvents: 'none'
          }}></div>

          <div style={{ 
            width: '100%',
            maxWidth: '500px',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            zIndex: 10,
            border: '1px solid #334155',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              marginBottom: '32px', 
              borderBottom: '1px solid #334155', 
              paddingBottom: '24px'
            }}>
               <div style={{ 
                 backgroundColor: 'rgba(59, 130, 246, 0.2)',
                 padding: '12px',
                 borderRadius: '50%'
               }}>
                    <User style={{ color: '#3b82f6', width: '32px', height: '32px' }} />
               </div>
               <div>
                   <h2 style={{ 
                     fontSize: '24px', 
                     fontWeight: 'bold', 
                     color: 'white',
                     margin: 0
                   }}>构建画像</h2>
                   <p style={{ 
                     fontSize: '12px', 
                     color: '#3b82f6',
                     margin: 0,
                     textTransform: 'uppercase',
                     letterSpacing: '1px'
                   }}>PERSONALIZED CONFIGURATION</p>
               </div>
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(30, 64, 175, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '32px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
                <p style={{ 
                  color: '#93c5fd', 
                  fontSize: '14px', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                    <Info style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                    我们将根据您的画像定制“适配率”算法：<br/>
                    • 资金体量 -> 影响对市场流动性与平台主力动向的权重<br/>
                    • 风险偏好 -> 调整对激进评论与稳健分析的采纳比例
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#e2e8f0', 
                      marginBottom: '12px', 
                      fontWeight: '500',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                        <span>资金体量</span>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>Capital Scale</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {['< 10万 (起步)', '10-50万 (进阶)', '50-200万 (专业)', '> 200万 (机构)'].map((label, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setLocalProfile({...localProfile, capital: idx})}
                                style={{ 
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  fontSize: '14px',
                                  transition: 'all 0.2s',
                                  fontWeight: '500',
                                  backgroundColor: localProfile.capital === idx ? '#3b82f6' : 'rgba(30, 41, 59, 0.5)',
                                  borderColor: localProfile.capital === idx ? '#3b82f6' : '#475569',
                                  color: localProfile.capital === idx ? 'white' : '#94a3b8',
                                  cursor: 'pointer',
                                  boxShadow: localProfile.capital === idx ? '0 10px 15px -3px rgba(59, 130, 246, 0.2)' : 'none'
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#e2e8f0', 
                      marginBottom: '12px', 
                      fontWeight: '500',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                        <span>风险承受能力</span>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>Risk Tolerance</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                         {['保守型', '稳健型', '激进型'].map((label, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setLocalProfile({...localProfile, riskTolerance: idx})}
                                style={{ 
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  fontSize: '14px',
                                  transition: 'all 0.2s',
                                  fontWeight: '500',
                                  backgroundColor: localProfile.riskTolerance === idx ? '#10b981' : 'rgba(30, 41, 59, 0.5)',
                                  borderColor: localProfile.riskTolerance === idx ? '#10b981' : '#475569',
                                  color: localProfile.riskTolerance === idx ? 'white' : '#94a3b8',
                                  cursor: 'pointer',
                                  boxShadow: localProfile.riskTolerance === idx ? '0 10px 15px -3px rgba(16, 185, 129, 0.2)' : 'none'
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ paddingTop: '16px' }}>
                    <button 
                        onClick={() => handleProfileSubmit(localProfile)}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(to right, #3b82f6, #6366f1)',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: '16px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)',
                          fontSize: '16px',
                          transform: 'scale(1)'
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = 'scale(0.98)';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        生成个性化算法模型
                    </button>
                </div>
            </div>
          </div>
        </div>
      );
  };

  const DashboardView = () => (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white', paddingBottom: '80px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        borderBottom: '1px solid #1e293b',
        padding: '12px 16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer'
            }} onClick={() => setView('DASHBOARD')}>
                <div style={{ 
                  background: 'linear-gradient(to right bottom, #3b82f6, #6366f1)',
                  padding: '6px',
                  borderRadius: '6px'
                }}>
                    <TrendingUp style={{ color: 'white', width: '20px', height: '20px' }} />
                </div>
                <h1 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  letterSpacing: '-0.5px',
                  margin: 0
                }}>
                    评准星 <span style={{ color: '#3b82f6' }}>Alpha</span>
                </h1>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              width: '100%', 
              maxWidth: '400px', 
              marginLeft: '16px'
            }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input 
                        type="text" 
                        placeholder="输入股票代码或名称 (如: 600519)"
                        style={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          padding: '8px 12px 8px 32px',
                          width: '100%',
                          outline: 'none',
                          color: 'white',
                          fontSize: '14px',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.borderColor = '#3b82f6';
                          e.currentTarget.boxShadow = '0 0 0 1px rgba(59, 130, 246, 0.5)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.borderColor = '#475569';
                          e.currentTarget.boxShadow = 'none';
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search style={{ 
                      position: 'absolute', 
                      left: '8px', 
                      top: '8px', 
                      color: '#64748b', 
                      width: '16px', 
                      height: '16px' 
                    }} />
                </div>
                <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    style={{ 
                      backgroundColor: isLoading ? '#475569' : '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                >
                    {isLoading ? '搜索中...' : '推荐'}
                </button>
            </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '16px auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {!stockData ? (
           <div style={{ textAlign: 'center', padding: '128px 0', animation: 'fadeIn 0.5s' }}>
               <div style={{ 
                 backgroundColor: 'rgba(30, 41, 59, 0.5)',
                 padding: '40px',
                 borderRadius: '24px',
                 display: 'inline-block',
                 border: '1px solid #1e293b',
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
               }}>
                   <div style={{ 
                     backgroundColor: '#1e293b',
                     width: '80px',
                     height: '80px',
                     borderRadius: '50%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     margin: '0 auto 24px'
                   }}>
                        <BarChart2 style={{ color: '#3b82f6', width: '40px', height: '40px' }} />
                   </div>
                   <h2 style={{ 
                     fontSize: '20px', 
                     fontWeight: 'bold', 
                     color: 'white',
                     margin: '0 0 8px'
                   }}>开始您的精准投资决策</h2>
                   <p style={{ 
                     color: '#94a3b8', 
                     maxWidth: '300px',
                     margin: '0 auto',
                     fontSize: '14px'
                   }}>
                       请输入您关注的股票，我们将通过全网大数据分析，为您匹配最值得信赖的决策辅助平台。
                   </p>
               </div>
           </div>
        ) : (
            <>
                {/* Stock Overview Card */}
                <div style={{ 
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: '1px solid #1e293b',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(12px)'
                }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0, 
                      width: '66%', 
                      height: '100%', 
                      opacity: 0.3,
                      pointerEvents: 'none'
                    }}>
                         {stockData.generatedImage && (
                            <img 
                              src={stockData.generatedImage} 
                              alt="Visualization" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                maskImage: 'linear-gradient(to left, black, transparent)'
                              }} 
                            />
                         )}
                         <div style={{ 
                           position: 'absolute', 
                           inset: 0, 
                           background: 'linear-gradient(to left, #020617, rgba(2, 6, 23, 0.8), transparent)'
                         }}></div>
                    </div>
                    
                    <div style={{ position: 'relative', zIndex: 10, padding: '24px 32px' }}>
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start', 
                          gap: '16px'
                        }}>
                            <div>
                                <h2 style={{ 
                                  fontSize: '32px', 
                                  fontWeight: '800', 
                                  color: 'white',
                                  margin: '0 0 4px',
                                  letterSpacing: '-0.5px'
                                }}>{stockData.name}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ 
                                      backgroundColor: '#1e293b',
                                      color: '#93c5fd',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      fontFamily: 'monospace',
                                      border: '1px solid #475569'
                                    }}>{stockData.symbol}</span>
                                    <span style={{ 
                                      color: '#64748b', 
                                      fontSize: '10px', 
                                      textTransform: 'uppercase',
                                      letterSpacing: '1px'
                                    }}>Real-time Analysis</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ 
                                  fontSize: '32px', 
                                  fontWeight: 'bold', 
                                  fontFamily: 'monospace', 
                                  color: 'white',
                                  margin: 0
                                }}>
                                    <span style={{ fontSize: '18px', color: '#64748b', marginRight: '4px' }}>¥</span>{stockData.price.toFixed(2)}
                                </p>
                                <p style={{ 
                                  fontSize: '18px', 
                                  fontFamily: 'monospace', 
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  gap: '4px',
                                  margin: 0,
                                  color: stockData.changePercent >= 0 ? '#ef4444' : '#22c55e'
                                }}>
                                    {stockData.changePercent >= 0 ? <TrendingUp size={16}/> : <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }}/>}
                                    {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
                            {/* Risk Report */}
                            <div style={{ 
                              backgroundColor: 'rgba(30, 41, 59, 0.8)',
                              padding: '20px',
                              borderRadius: '12px',
                              border: '1px solid rgba(71, 85, 105, 0.5)',
                              backdropFilter: 'blur(4px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Shield style={{ width: '16px', height: '16px', color: '#f97316' }} />
                                    <h3 style={{ 
                                      fontSize: '12px', 
                                      fontWeight: 'bold', 
                                      color: '#f97316',
                                      textTransform: 'uppercase',
                                      letterSpacing: '1px',
                                      margin: 0
                                    }}>AI 风险评估报告</h3>
                                </div>
                                <p style={{ 
                                  fontSize: '14px', 
                                  color: '#e2e8f0',
                                  lineHeight: '1.5',
                                  textAlign: 'justify',
                                  height: '96px',
                                  overflowY: 'auto',
                                  paddingRight: '8px',
                                  margin: 0,
                                  scrollbarWidth: 'thin',
                                  scrollbarColor: '#475569 #1e293b'
                                }}>
                                    {stockData.riskReport}
                                </p>
                            </div>

                            {/* Recent Situation - NEW */}
                            <div style={{ 
                              backgroundColor: 'rgba(30, 41, 59, 0.8)',
                              padding: '20px',
                              borderRadius: '12px',
                              border: '1px solid rgba(71, 85, 105, 0.5)',
                              backdropFilter: 'blur(4px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Activity style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                                    <h3 style={{ 
                                      fontSize: '12px', 
                                      fontWeight: 'bold', 
                                      color: '#3b82f6',
                                      textTransform: 'uppercase',
                                      letterSpacing: '1px',
                                      margin: 0
                                    }}>近期市场动态</h3>
                                </div>
                                <p style={{ 
                                  fontSize: '14px', 
                                  color: '#e2e8f0',
                                  lineHeight: '1.5',
                                  textAlign: 'justify',
                                  height: '96px',
                                  overflowY: 'auto',
                                  paddingRight: '8px',
                                  margin: 0,
                                  scrollbarWidth: 'thin',
                                  scrollbarColor: '#475569 #1e293b'
                                }}>
                                    {stockData.recentSituation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ 
                          fontSize: '20px', 
                          fontWeight: 'bold', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          margin: 0
                        }}>
                            <CheckCircle style={{ width: '24px', height: '24px', color: '#10b981' }} />
                            平台智能优选
                        </h3>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#64748b',
                          display: 'flex',
                          gap: '16px'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }}></div> 
                              综合评分最高
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#475569' }}></div> 
                              次优选择
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {stockData.platforms.map((platform, idx) => (
                            <div 
                                key={platform.id}
                                onClick={() => handlePlatformClick(platform)}
                                style={{ 
                                  padding: '20px',
                                  borderRadius: '12px',
                                  border: '1px solid #475569',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                  backdropFilter: 'blur(12px)'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.borderColor = '#3b82f6';
                                  e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.borderColor = '#475569';
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{ 
                                  position: 'absolute', 
                                  top: 0, 
                                  left: 0, 
                                  width: '4px', 
                                  height: '100%',
                                  background: 'linear-gradient(to bottom, #3b82f6, transparent)',
                                  opacity: 0,
                                  transition: 'opacity 0.2s'
                                }} 
                                onMouseOver={(e) => {
                                  e.currentTarget.opacity = 1;
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.opacity = 0;
                                }}></div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ 
                                          width: '40px',
                                          height: '40px',
                                          borderRadius: '8px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontWeight: 'bold',
                                          fontSize: '18px',
                                          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                                          backgroundColor: idx === 0 ? '#eab308' : '#475569',
                                          color: idx === 0 ? 'black' : '#94a3b8',
                                          boxShadow: idx === 0 ? '0 0 0 4px rgba(234, 179, 8, 0.2)' : 'none'
                                        }}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 style={{ 
                                              fontSize: '18px', 
                                              fontWeight: 'bold',
                                              margin: 0,
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '8px',
                                              transition: 'color 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                              e.currentTarget.style.color = '#3b82f6';
                                            }}
                                            onMouseOut={(e) => {
                                              e.currentTarget.style.color = 'white';
                                            }}>
                                                {platform.name}
                                                <ExternalLink style={{ width: '12px', height: '12px', color: '#64748b', transition: 'color 0.2s' }} 
                                                onMouseOver={(e) => {
                                                  e.currentTarget.style.color = '#3b82f6';
                                                }}
                                                onMouseOut={(e) => {
                                                  e.currentTarget.style.color = '#64748b';
                                                }}/>
                                            </h4>
                                            <span style={{ 
                                              fontSize: '10px', 
                                              color: '#64748b'
                                            }}>{platform.recentSignal === 'Buy' ? '近期倾向: 看涨' : platform.recentSignal === 'Sell' ? '近期倾向: 看跌' : '近期倾向: 观望'}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span style={{ 
                                              fontSize: '10px', 
                                              color: '#94a3b8',
                                              textTransform: 'uppercase',
                                              letterSpacing: '1px',
                                              marginBottom: '4px'
                                            }}>推荐指数</span>
                                            <div style={{ 
                                              fontSize: '36px', 
                                              fontWeight: 'bold', 
                                              color: '#eab308',
                                              fontFamily: 'monospace',
                                              lineHeight: 1
                                            }}>{platform.matchRate}<span style={{ fontSize: '14px', color: '#64748b', marginLeft: '2px' }}>%</span></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
                                    <div style={{ height: '6px', flex: 1, backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ 
                                          height: '100%', 
                                          backgroundColor: '#eab308',
                                          borderRadius: '3px',
                                          width: `${platform.matchRate}%`
                                        }}></div>
                                    </div>
                                </div>

                                <div style={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: '1fr 1fr',
                                  gridTemplateColumns: '1fr 1fr 1fr' ,
                                  gap: '16px',
                                  fontSize: '12px',
                                  color: '#94a3b8',
                                  marginTop: '16px',
                                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(71, 85, 105, 0.5)'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ 
                                          fontSize: '10px', 
                                          color: '#64748b',
                                          transform: 'scale(0.9)',
                                          transformOrigin: 'top left',
                                          marginBottom: '4px'
                                        }}>预测准确率</span>
                                        <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px' }}>{platform.accuracyScore}%</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ 
                                          fontSize: '10px', 
                                          color: '#64748b',
                                          transform: 'scale(0.9)',
                                          transformOrigin: 'top left',
                                          marginBottom: '4px'
                                        }}>群体智慧密度</span>
                                        <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px' }}>{platform.communityWisdom}%</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', display: { sm: 'flex', default: 'none' } }}>
                                        <span style={{ 
                                          fontSize: '10px', 
                                          color: '#64748b',
                                          transform: 'scale(0.9)',
                                          transformOrigin: 'top left',
                                          marginBottom: '4px'
                                        }}>用户适配度</span>
                                        <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px' }}>{platform.userFit}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grounding Sources */}
                {stockData.groundingUrls.length > 0 && (
                    <div style={{ marginTop: '32px', borderTop: '1px solid #1e293b', paddingTop: '24px' }}>
                        <h4 style={{ 
                          fontSize: '10px', 
                          fontWeight: 'bold', 
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          margin: '0 0 12px'
                        }}>数据来源 (Grounding Sources)</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {stockData.groundingUrls.map((url, i) => (
                                <a 
                                  key={i} 
                                  href={url.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  style={{ 
                                    fontSize: '12px', 
                                    color: '#3b82f6',
                                    textDecoration: 'none',
                                    backgroundColor: '#1e293b',
                                    padding: '6px 12px',
                                    borderRadius: '100px',
                                    border: '1px solid #475569',
                                    transition: 'all 0.2s',
                                    maxWidth: '200px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.borderColor = '#3b82f6';
                                    e.currentTarget.textDecoration = 'underline';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.borderColor = '#475569';
                                    e.currentTarget.textDecoration = 'none';
                                  }}
                                >
                                    {url.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  );

  const PlatformDetailView = () => {
    if (!selectedPlatform || !stockData) return <DashboardView />;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
        <header style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          borderBottom: '1px solid #1e293b',
          padding: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)'
        }}>
           <button 
             onClick={() => setView('DASHBOARD')}
             style={{ 
               backgroundColor: 'transparent',
               border: 'none',
               padding: '8px',
               borderRadius: '50%',
               cursor: 'pointer',
               transition: 'background-color 0.2s'
             }}
             onMouseOver={(e) => {
               e.currentTarget.style.backgroundColor = '#1e293b';
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.backgroundColor = 'transparent';
             }}
           >
               <ArrowRight style={{ transform: 'rotate(180deg)', width: '20px', height: '20px', color: '#94a3b8' }} 
               onMouseOver={(e) => {
                 e.currentTarget.style.color = 'white';
               }}
               onMouseOut={(e) => {
                 e.currentTarget.style.color = '#94a3b8';
               }}/>
           </button>
           <div>
               <h1 style={{ 
                 fontSize: '18px', 
                 fontWeight: 'bold',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '8px',
                 margin: 0
               }}>
                   {selectedPlatform.name} 
                   <span style={{ color: '#64748b', fontWeight: 'normal' }}>|</span>
                   <span style={{ color: '#3b82f6', fontSize: '14px' }}>深度解析</span>
               </h1>
               <p style={{ 
                 fontSize: '10px', 
                 color: '#64748b',
                 margin: 0
               }}>Target: {stockData.name} ({stockData.symbol})</p>
           </div>
        </header>

        <main style={{ maxWidth: '1400px', margin: '16px auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                {[
                    { label: '综合推荐率', value: selectedPlatform.matchRate, color: '#eab308', border: '#eab308', tooltip: '算法模型：(准确率×40% + 适配度×30% + 智慧度×30%)' },
                    { label: '历史准确率', value: selectedPlatform.accuracyScore, color: '#22c55e', border: '#10b981', tooltip: '算法模型：过去30天平台情感指数与次日股价涨跌的皮尔逊相关系数' },
                    { label: '用户适配度', value: selectedPlatform.userFit, color: '#3b82f6', border: '#3b82f6', tooltip: '算法模型：基于您的资金体量与风险偏好与平台用户画像的余弦相似度' },
                    { label: '近期信号', value: selectedPlatform.recentSignal === 'Buy' ? '看涨' : selectedPlatform.recentSignal === 'Sell' ? '看跌' : '持仓', color: selectedPlatform.recentSignal === 'Buy' ? '#ef4444' : selectedPlatform.recentSignal === 'Sell' ? '#22c55e' : '#e2e8f0', border: '#9333ea', tooltip: '算法模型：NLP提取最近24小时评论中的显性买卖指令' }
                ].map((stat, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        padding: '16px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        borderTop: `4px solid ${stat.border}`,
                        position: 'relative',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid #1e293b'
                      }}
                      className="group"
                    >
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#94a3b8',
                          margin: '0 0 8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          cursor: 'help'
                        }}>
                            {stat.label} 
                            <Info style={{ width: '12px', height: '12px', color: '#64748b' }} />
                        </p>
                        <p style={{ 
                          fontSize: '36px', 
                          fontWeight: 'bold',
                          color: stat.color,
                          fontFamily: 'monospace',
                          margin: 0
                        }}>{stat.value}<span style={{ fontSize: '14px', opacity: 0.5, marginLeft: '4px' }}>{typeof stat.value === 'number' ? '%' : ''}</span></p>
                        
                        {/* Tooltip */}
                        <div style={{ 
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginTop: '8px',
                          width: '192px',
                          padding: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          fontSize: '10px',
                          color: '#e2e8f0',
                          borderRadius: '4px',
                          border: '1px solid #475569',
                          opacity: 0,
                          pointerEvents: 'none',
                          transition: 'opacity 0.2s',
                          zIndex: 20
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.opacity = 1;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.opacity = 0;
                        }}>
                            {stat.tooltip}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Main Content Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Why This Platform */}
                    <div style={{ 
                      padding: '24px',
                      borderRadius: '16px',
                      border: '1px solid #1e293b',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold',
                          margin: '0 0 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'white'
                        }}>
                            <Zap style={{ width: '20px', height: '20px', color: '#eab308' }} />
                            AI 推荐理由
                        </h3>
                        <p style={{ 
                          color: '#e2e8f0',
                          lineHeight: '1.8',
                          fontSize: '16px',
                          fontWeight: '300',
                          borderLeft: '2px solid #475569',
                          paddingLeft: '16px',
                          margin: 0
                        }}>
                            {selectedPlatform.description}
                        </p>
                        <div style={{ 
                          marginTop: '24px',
                          padding: '16px',
                          backgroundColor: '#1e293b',
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: '#94a3b8',
                          border: '1px solid #475569'
                        }}>
                            <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px' }}>算法解析：</strong> 
                            该平台在过去30天内，针对{stockData.name}的“{selectedPlatform.recentSignal === 'Buy' ? '积极/买入' : selectedPlatform.recentSignal === 'Sell' ? '恐慌/卖出' : '观望'}”情绪指数与实际走势吻合度极高。
                            结合您的{userProfile.riskTolerance === 0 ? '保守型' : '稳健/激进型'}偏好，该平台的{selectedPlatform.name.includes('雪球') ? '深度逻辑分析（Smart Money）' : '市场情绪传导（Hot Money）'}权重被算法自动放大，以匹配您的决策需求。
                        </div>
                    </div>

                    {/* K-Line Chart */}
                    <div style={{ 
                      padding: '8px',
                      borderRadius: '16px',
                      border: '1px solid #1e293b',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}>
                         <StockChart data={kLineData} />
                         <div style={{ 
                           padding: '0 16px 8px',
                           fontSize: '10px',
                           color: '#64748b',
                           textAlign: 'center'
                         }}>
                            * 注：K线图为基于真实价格({stockData.price})与近期趋势({stockData.changePercent}%)生成的模拟走势，仅供趋势参考。
                         </div>
                    </div>
                </div>

                {/* Sidebar Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Radar */}
                    <div style={{ 
                      padding: '8px',
                      borderRadius: '16px',
                      border: '1px solid #1e293b',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(12px)'
                    }}>
                        <RadarDetail platform={selectedPlatform} />
                    </div>

                    {/* Algorithm Footer Box */}
                    <div style={{ 
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px dashed #475569',
                      backgroundColor: 'rgba(30, 41, 59, 0.3)',
                      fontSize: '12px',
                      color: '#94a3b8',
                      lineHeight: '1.6'
                    }}>
                        <h4 style={{ 
                          fontWeight: 'bold',
                          margin: '0 0 12px',
                          color: '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                            <Activity style={{ width: '12px', height: '12px' }} />
                            关于“评准星”算法模型
                        </h4>
                        <ul style={{ 
                          margin: 0,
                          paddingLeft: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                            <li><span style={{ color: '#e2e8f0' }}>评论价值评估：</span>运用NLP识别用户明确的“买/持/卖”指令（Buy=1），过滤无效灌水。</li>
                            <li><span style={{ color: '#e2e8f0' }}>准确率回测：</span>计算平台情绪指标与次日股价涨跌的吻合度。</li>
                            <li><span style={{ color: '#e2e8f0' }}>跨平台效能：</span>结合市场传导力与群体智慧密度，综合评分。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
      </div>
    );
  }

  // Router
  switch(view) {
    case 'LOGIN': return <LoginView />;
    case 'PROFILE': return <ProfileView />;
    case 'DASHBOARD': return <DashboardView />;
    case 'PLATFORM_DETAIL': return <PlatformDetailView />;
    default: return <LoginView />;
  }
};

export default App;
