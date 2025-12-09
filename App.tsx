import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Shield, BarChart2, ArrowRight, User, CheckCircle, Info, ExternalLink, Activity, Zap } from 'lucide-react';
import { AppView, UserProfile, StockData, PlatformMetric, KLineData } from './types';
import { analyzeStockWithSearch } from './services/geminiService';
import StockChart from './components/StockChart';
import RadarDetail from './components/RadarDetail';

// Mock K-line data generator anchored to REAL current price
const generateSimulatedKLine = (days: number, currentPrice: number, trend: 'up' | 'down' | 'flat'): KLineData[] => {
  const data: KLineData[] = [];
  let price = currentPrice;
  
  // Work backwards from today
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Trend bias
    let bias = 0;
    if (trend === 'up') bias = -0.2; // Past was lower
    if (trend === 'down') bias = 0.2; // Past was higher
    
    const volatility = price * 0.02; // 2% daily volatility
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

    price = open; // Previous day's close is roughly today's open (simplified)
  }
  return data;
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
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
  const handleLogin = () => setView(AppView.PROFILE);
  
  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setView(AppView.DASHBOARD);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setStockData(null);
    
    // Use Real Data Search Service
    const data = await analyzeStockWithSearch(searchQuery.trim(), userProfile);
    
    if (data) {
        setStockData(data);
        // Simulate K-Line based on the real change percent fetched
        const trend = data.changePercent > 0.5 ? 'up' : data.changePercent < -0.5 ? 'down' : 'flat';
        setKLineData(generateSimulatedKLine(30, data.price, trend));
    } else {
        alert("抱歉，暂时无法获取该股票数据，请检查拼写或稍后重试。");
    }

    setIsLoading(false);
  };

  const handlePlatformClick = (platform: PlatformMetric) => {
    setSelectedPlatform(platform);
    setView(AppView.PLATFORM_DETAIL);
  };

  // --- Views ---

  const LoginView = () => (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0f172a]">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=4')] bg-cover opacity-10 z-0"></div>
      <div className="z-10 text-center space-y-8 p-10 rounded-3xl max-w-md w-full mx-4 shadow-2xl shadow-blue-900/30 border border-slate-700" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
        <div className="flex justify-center mb-6">
           <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-5 rounded-2xl shadow-lg shadow-blue-500/20">
             <TrendingUp size={56} className="text-white" />
           </div>
        </div>
        <div>
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 tracking-tight">
            评准星
            </h1>
            <p className="text-blue-200/60 mt-2 font-mono text-sm tracking-widest uppercase">Ping Zhuan Xing</p>
        </div>
        <p className="text-gray-400 text-lg font-light leading-relaxed">
          智能股评量化优选系统<br/>
          <span className="text-sm opacity-70">基于真实市场情绪的大数据决策引擎</span>
        </p>
        <button 
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
        >
          立即开启 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const ProfileView = () => {
      const [localProfile, setLocalProfile] = useState(userProfile);
      
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

          <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl relative z-10 border border-slate-700" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6">
               <div className="bg-blue-500/20 p-3 rounded-full">
                    <User className="text-blue-400 w-8 h-8" />
               </div>
               <div>
                   <h2 className="text-2xl font-bold text-white">构建画像</h2>
                   <p className="text-xs text-blue-400">PERSONALIZED CONFIGURATION</p>
               </div>
            </div>
            
            <div className="bg-blue-900/20 p-4 rounded-lg mb-8 border border-blue-500/30">
                <p className="text-blue-200 text-sm flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    我们将根据您的画像定制“适配率”算法：<br/>
                    • 资金体量 -> 影响对市场流动性与平台主力动向的权重<br/>
                    • 风险偏好 -> 调整对激进评论与稳健分析的采纳比例
                </p>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="block text-gray-300 mb-3 font-medium flex justify-between">
                        <span>资金体量</span>
                        <span className="text-xs text-gray-500">Capital Scale</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {['< 10万 (起步)', '10-50万 (进阶)', '50-200万 (专业)', '> 200万 (机构)'].map((label, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setLocalProfile({...localProfile, capital: idx})}
                                className={`py-3 px-4 rounded-lg border text-sm transition-all font-medium ${
                                    localProfile.capital === idx 
                                    ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                    : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:bg-slate-700 hover:border-slate-600'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 mb-3 font-medium flex justify-between">
                        <span>风险承受能力</span>
                        <span className="text-xs text-gray-500">Risk Tolerance</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                         {['保守型', '稳健型', '激进型'].map((label, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setLocalProfile({...localProfile, riskTolerance: idx})}
                                className={`py-3 px-4 rounded-lg border text-sm transition-all font-medium ${
                                    localProfile.riskTolerance === idx 
                                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:bg-slate-700 hover:border-slate-600'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={() => handleProfileSubmit(localProfile)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all"
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
    <div className="min-h-screen bg-slate-950 text-white pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 px-4 py-3 shadow-lg" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg">
                    <TrendingUp className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">
                    评准星 <span className="text-blue-500">Alpha</span>
                </h1>
            </div>
            
            <div className="flex items-center gap-2 w-full max-w-xs ml-4">
                <div className="relative w-full">
                    <input 
                        type="text" 
                        placeholder="输入股票代码或名称 (如: 600519)"
                        className="bg-slate-900/80 border border-slate-700 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                </div>
                <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                    {isLoading ? '搜索中...' : '推荐'}
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6 mt-4">
        {!stockData ? (
           <div className="text-center py-32">
               <div className="bg-slate-900/50 p-10 rounded-3xl inline-block border border-slate-800 shadow-xl">
                   <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BarChart2 className="w-10 h-10 text-blue-500" />
                   </div>
                   <h2 className="text-xl font-bold text-white mb-2">开始您的精准投资决策</h2>
                   <p className="text-gray-400 max-w-sm mx-auto">
                       请输入您关注的股票，我们将通过全网大数据分析，为您匹配最值得信赖的决策辅助平台。
                   </p>
               </div>
           </div>
        ) : (
            <>
                {/* Stock Overview Card */}
                <div className="rounded-2xl relative overflow-hidden shadow-2xl border border-slate-700" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                    <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 pointer-events-none">
                         {stockData.generatedImage && (
                            <img src={stockData.generatedImage} alt="Visualization" className="w-full h-full object-cover" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
                         )}
                         <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-6 sm:p-8">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">{stockData.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="bg-slate-800 text-blue-400 px-2 py-0.5 rounded text-sm font-mono border border-slate-700">{stockData.symbol}</span>
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Real-time Analysis</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl sm:text-4xl font-bold font-mono text-white">
                                    <span className="text-lg text-gray-500 mr-1">¥</span>{stockData.price.toFixed(2)}
                                </p>
                                <p className={`text-lg font-mono font-bold flex items-center justify-end gap-1 ${stockData.changePercent >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {stockData.changePercent >= 0 ? <TrendingUp size={16}/> : <TrendingUp size={16} className="rotate-180"/>}
                                    {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            {/* Risk Report */}
                            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="w-4 h-4 text-orange-400" />
                                    <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">AI 风险评估报告</h3>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed text-justify h-24 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}>
                                    {stockData.riskReport}
                                </p>
                            </div>

                            {/* Recent Situation - NEW */}
                            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">近期市场动态</h3>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed text-justify h-24 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}>
                                    {stockData.recentSituation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            平台智能优选
                        </h3>
                        <div className="text-xs text-gray-500 flex gap-4">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> 综合评分最高</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600"></div> 次优选择</span>
                        </div>
                    </div>
                    
                    <div className="grid gap-4">
                        {stockData.platforms.map((platform, idx) => (
                            <div 
                                key={platform.id}
                                onClick={() => handlePlatformClick(platform)}
                                className="p-5 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:translate-x-1 group relative overflow-hidden"
                                style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner ${idx === 0 ? 'bg-yellow-500 text-black shadow-orange-500/20' : 'bg-slate-700 text-gray-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                                {platform.name}
                                                <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400" />
                                            </h4>
                                            <span className="text-xs text-gray-500">{platform.recentSignal === 'Buy' ? '近期倾向: 看涨' : platform.recentSignal === 'Sell' ? '近期倾向: 看跌' : '近期倾向: 观望'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">推荐指数</span>
                                            <div className="text-3xl font-bold text-yellow-500 font-mono leading-none">{platform.matchRate}<span className="text-sm text-gray-500">%</span></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 my-3">
                                    <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${platform.matchRate}%` }}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-gray-400 mt-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                                    <div className="flex flex-col">
                                        <span className="scale-90 origin-top-left text-gray-500 mb-1">预测准确率</span>
                                        <span className="text-white font-mono text-sm">{platform.accuracyScore}%</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="scale-90 origin-top-left text-gray-500 mb-1">群体智慧密度</span>
                                        <span className="text-white font-mono text-sm">{platform.communityWisdom}%</span>
                                    </div>
                                    <div className="flex flex-col hidden sm:flex">
                                        <span className="scale-90 origin-top-left text-gray-500 mb-1">用户适配度</span>
                                        <span className="text-white font-mono text-sm">{platform.userFit}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grounding Sources */}
                {stockData.groundingUrls.length > 0 && (
                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">数据来源 (Grounding Sources)</h4>
                        <div className="flex flex-wrap gap-2">
                            {stockData.groundingUrls.map((url, i) => (
                                <a key={i} href={url.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700 hover:border-blue-500 transition-colors truncate max-w-[200px]">
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
      <div className="min-h-screen bg-slate-950 text-white pb-10 font-sans">
        <header className="sticky top-0 z-50 border-b border-gray-800 p-4 shadow-lg flex items-center gap-4" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
           <button onClick={() => setView(AppView.DASHBOARD)} className="hover:bg-slate-800 p-2 rounded-full transition-colors group">
               <ArrowRight className="rotate-180 w-5 h-5 text-gray-400 group-hover:text-white" />
           </button>
           <div>
               <h1 className="text-lg font-bold flex items-center gap-2">
                   {selectedPlatform.name} 
                   <span className="text-gray-500 font-normal">|</span>
                   <span className="text-blue-400 text-sm">深度解析</span>
               </h1>
               <p className="text-xs text-gray-500">Target: {stockData.name} ({stockData.symbol})</p>
           </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 space-y-6 mt-4">
            
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: '综合推荐率', value: selectedPlatform.matchRate, color: 'text-yellow-500', border: 'border-t-yellow-500', tooltip: '算法模型：(准确率×40% + 适配度×30% + 智慧度×30%)' },
                    { label: '历史准确率', value: selectedPlatform.accuracyScore, color: 'text-green-400', border: 'border-t-green-500', tooltip: '算法模型：过去30天平台情感指数与次日股价涨跌的皮尔逊相关系数' },
                    { label: '用户适配度', value: selectedPlatform.userFit, color: 'text-blue-400', border: 'border-t-blue-500', tooltip: '算法模型：基于您的资金体量与风险偏好与平台用户画像的余弦相似度' },
                    { label: '近期信号', value: selectedPlatform.recentSignal === 'Buy' ? '看涨' : selectedPlatform.recentSignal === 'Sell' ? '看跌' : '持仓', color: selectedPlatform.recentSignal === 'Buy' ? 'text-red-500' : selectedPlatform.recentSignal === 'Sell' ? 'text-green-500' : 'text-gray-300', border: 'border-t-purple-500', tooltip: '算法模型：NLP提取最近24小时评论中的显性买卖指令' }
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl text-center border ${stat.border} relative group`} style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                        <p className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1 cursor-help">
                            {stat.label} 
                            <Info className="w-3 h-3 text-gray-600" />
                        </p>
                        <p className={`text-3xl font-bold ${stat.color} font-mono`}>{stat.value}<span className="text-sm opacity-50 ml-1">{typeof stat.value === 'number' ? '%' : ''}</span></p>
                        
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-black/90 text-xs text-gray-300 rounded border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            {stat.tooltip}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content Left */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Why This Platform */}
                    <div className="p-6 rounded-2xl border border-slate-700" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            AI 推荐理由
                        </h3>
                        <p className="text-gray-300 leading-loose text-base font-light border-l-2 border-slate-600 pl-4">
                            {selectedPlatform.description}
                        </p>
                        <div className="mt-6 p-4 bg-slate-900 rounded-lg text-sm text-gray-400 border border-slate-800">
                            <strong className="text-gray-300 block mb-2">算法解析：</strong> 
                            该平台在过去30天内，针对{stockData.name}的“{selectedPlatform.recentSignal === 'Buy' ? '积极/买入' : selectedPlatform.recentSignal === 'Sell' ? '恐慌/卖出' : '观望'}”情绪指数与实际走势吻合度极高。
                            结合您的{userProfile.riskTolerance === 0 ? '保守型' : '稳健/激进型'}偏好，该平台的{selectedPlatform.name.includes('雪球') ? '深度逻辑分析（Smart Money）' : '市场情绪传导（Hot Money）'}权重被算法自动放大，以匹配您的决策需求。
                        </div>
                    </div>

                    {/* K-Line Chart */}
                    <div className="p-2 rounded-2xl border border-slate-700" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                         <StockChart data={kLineData} />
                         <div className="px-4 pb-2 text-xs text-gray-500 text-center">
                            * 注：K线图为基于真实价格({stockData.price})与近期趋势({stockData.changePercent}%)生成的模拟走势，仅供趋势参考。
                         </div>
                    </div>
                </div>

                {/* Sidebar Right */}
                <div className="space-y-6">
                    {/* Radar */}
                    <div className="p-2 rounded-2xl border border-slate-700" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                        <RadarDetail platform={selectedPlatform} />
                    </div>

                    {/* Algorithm Footer Box */}
                    <div className="p-5 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-xs text-gray-400 leading-relaxed">
                        <h4 className="font-bold mb-3 text-gray-300 flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            关于“评准星”算法模型
                        </h4>
                        <ul className="space-y-2 list-disc list-inside">
                            <li><span className="text-gray-300">评论价值评估：</span>运用NLP识别用户明确的“买/持/卖”指令（Buy=1），过滤无效灌水。</li>
                            <li><span className="text-gray-300">准确率回测：</span>计算平台情绪指标与次日股价涨跌的皮尔逊相关系数。</li>
                            <li><span className="text-gray-300">跨平台效能：</span>结合市场传导力与群体智慧密度，综合评分。</li>
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
    case AppView.LOGIN: return <LoginView />;
    case AppView.PROFILE: return <ProfileView />;
    case AppView.DASHBOARD: return <DashboardView />;
    case AppView.PLATFORM_DETAIL: return <PlatformDetailView />;
    default: return <LoginView />;
  }
};

export default App;
