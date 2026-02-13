
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NetworkNode, NetworkHealth, NetworkAlert } from './types';
import { scanNetworkNodes, getNetworkHealth, analyzeNetworkThreat, generateRandomAlert } from './services/securityService';
import { NETWORK_ATTACK_COLORS, DEVICE_TYPE_ICONS } from './constants';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [health, setHealth] = useState<NetworkHealth>(getNetworkHealth());
  const [alerts, setAlerts] = useState<NetworkAlert[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [activeTab, setActiveTab] = useState<'topology' | 'security' | 'traffic' | 'ai'>('topology');

  useEffect(() => {
    if (isLockedDown) return;
    const timer = setInterval(() => {
      setHealth(getNetworkHealth());
      if (Math.random() > 0.96) {
        setAlerts(prev => [generateRandomAlert(), ...prev].slice(0, 12));
      }
    }, 2000);
    scanNetworkNodes().then(setNodes);
    return () => clearInterval(timer);
  }, [isLockedDown]);

  const handleDeepAnalysis = async (node: NetworkNode) => {
    if (isLockedDown) return;
    const relevantAlert = alerts.find(a => a.sourceIp === node.ip) || { attackType: 'Behavioral Anomaly' as any };
    setSelectedNode(node);
    setAiAnalysis(null);
    setActiveTab('ai');
    const result = await analyzeNetworkThreat(node, relevantAlert);
    setAiAnalysis(result);
  };

  const runFullDiscovery = async () => {
    if (isLockedDown) return;
    setIsScanning(true);
    setNodes([]); 
    await new Promise(r => setTimeout(r, 1800));
    const data = await scanNetworkNodes();
    setNodes(data);
    setIsScanning(false);
  };

  const toggleEmergencyStop = () => {
    setIsLockedDown(!isLockedDown);
    if (!isLockedDown) {
      setIsScanning(false);
      setAiAnalysis("MANUAL_KILL_SWITCH_ENGAGED: تم تجميد جميع العمليات الجارية في الشبكة.");
    } else {
      setAiAnalysis(null);
    }
  };

  return (
    <div className={`flex h-screen w-screen bg-[#010103] text-[#f1f5f9] overflow-hidden font-sans transition-all duration-700 ${isLockedDown ? 'grayscale-[0.8] contrast-[1.4] blur-[1px]' : ''}`}>
      
      {/* Sidebar */}
      <nav className="w-24 lg:w-72 border-r border-white/5 bg-[#050508] flex flex-col p-6 relative">
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent"></div>
        
        <div className="flex items-center gap-4 mb-16">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isLockedDown ? 'bg-red-900 shadow-red-900/50' : 'bg-indigo-600 shadow-indigo-600/30'}`}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">SOC_COMMAND <span className={isLockedDown ? 'text-red-500' : 'text-indigo-500'}>PRO</span></h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest">ENTERPRISE SEC OPS</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { id: 'topology', label: 'Network Assets', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
            { id: 'security', label: 'Incident Log', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            { id: 'ai', label: 'Forensic Lab', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.285a2 2 0 01-1.506 0l-.63-.285a6 6 0 00-3.86-.517l-2.388.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 00.586 3.414l7.17 1.792a4 4 0 002.484 0l7.17-1.792a2 2 0 00.586-3.414l-1.16-1.16zM12 13V4m0 0L8 8m4-4l4 4' }
          ].map(item => (
            <button
              key={item.id}
              disabled={isLockedDown && item.id !== 'ai'}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-slate-500 hover:text-indigo-400 hover:bg-white/5 disabled:opacity-20'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
              <span className="hidden lg:block font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <div className="hidden lg:block p-5 rounded-2xl border border-white/5 bg-black/40">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase text-slate-500">Node Connectivity</span>
                <span className={`w-2 h-2 rounded-full ${isLockedDown ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`}></span>
             </div>
             <div className="space-y-2 font-mono text-[9px]">
                <div className="flex justify-between"><span>ACTIVE_DEVICES:</span> <span className="text-white">{nodes.length}</span></div>
                <div className="flex justify-between"><span>ENCRYPTION:</span> <span className="text-indigo-400">AES-256</span></div>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Command Center */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Top Header */}
        <header className="h-24 border-b border-white/5 px-12 flex items-center justify-between bg-[#030305] relative z-20">
          <div>
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">Security Operations Console</h2>
            <div className="flex gap-4 mt-1 font-mono text-[9px] text-slate-500">
              <span>LATENCY: <span className={isLockedDown ? 'text-red-500' : 'text-emerald-400'}>{isLockedDown ? 'ERR_HALTED' : health.ping.toFixed(1) + 'ms'}</span></span>
              <span className="opacity-30">|</span>
              <span>BUFFER_STATUS: NOMINAL</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleEmergencyStop}
              className={`h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border ${isLockedDown ? 'bg-white text-black border-white' : 'bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border-red-500/30'}`}
            >
              {isLockedDown ? 'Reset Controller' : 'Kill Switch'}
            </button>

            <button 
              onClick={runFullDiscovery}
              disabled={isScanning || isLockedDown}
              className={`h-11 px-8 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all ${isScanning ? 'bg-slate-800 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-900/30'}`}
            >
              {isScanning ? 'Synchronizing...' : 'Asset Discovery'}
            </button>
          </div>
        </header>

        {/* Display Content */}
        <div className="flex-1 overflow-y-auto p-12 custom-scroll relative z-10">
          
          {activeTab === 'topology' && (
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all ${isLockedDown ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              {nodes.map(node => (
                <div key={node.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all group border-b-2 hover:border-b-indigo-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={DEVICE_TYPE_ICONS[node.type]} /></svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-200 uppercase tracking-tighter text-sm">{node.deviceName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{node.ip}</p>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mb-8 space-y-2 uppercase">
                    <div className="flex justify-between"><span>Vendor:</span> <span className="text-white">{node.vendor}</span></div>
                    <div className="flex justify-between"><span>MAC:</span> <span className="text-white">{node.mac}</span></div>
                  </div>
                  <button 
                    onClick={() => handleDeepAnalysis(node)}
                    className="w-full py-3 rounded-xl bg-indigo-600/5 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all border border-indigo-500/20"
                  >
                    Open Forensic Log
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className={`space-y-4 ${isLockedDown ? 'opacity-30' : ''}`}>
               <div className="bg-black border border-white/5 rounded-3xl p-10 shadow-2xl">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-red-500 mb-10 flex items-center gap-4">
                    <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                    Live Incident Monitoring
                  </h3>
                  <div className="space-y-2">
                    {alerts.map(alert => (
                      <div key={alert.id} className={`p-6 bg-white/[0.02] rounded-2xl border flex items-center justify-between hover:bg-white/[0.04] transition-all ${NETWORK_ATTACK_COLORS[alert.attackType]}`}>
                        <div className="flex items-center gap-8">
                           <div className="text-[9px] font-mono opacity-40">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                           <div className="font-black text-xs uppercase tracking-widest italic">{alert.attackType}</div>
                        </div>
                        <div className="text-[9px] font-mono text-slate-500">SOURCE: <span className="text-white">{alert.sourceIp}</span></div>
                        <div className="px-5 py-1.5 rounded-full border border-current text-[8px] font-black uppercase tracking-widest">{alert.mitigationStatus}</div>
                      </div>
                    ))}
                    {alerts.length === 0 && <div className="py-20 text-center text-slate-600 font-mono text-[10px] uppercase tracking-[0.5em]">Clear Feed - No Anomalies</div>}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="h-full flex flex-col gap-8">
               <div className={`bg-indigo-600/5 border border-indigo-500/10 rounded-3xl p-10 text-center relative overflow-hidden ${isLockedDown ? 'border-red-900/40 bg-red-950/10' : ''}`}>
                  <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                    {isLockedDown ? 'System Lockdown Protocol' : 'Neural Forensic Analysis'}
                  </h2>
                  <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.5em] font-mono">Tier-3 Human-Logic Verification Unit</p>
               </div>

               {selectedNode || isLockedDown ? (
                 <div className="flex-1 bg-black/40 border border-white/10 rounded-[2.5rem] p-12 font-mono relative backdrop-blur-xl">
                    <div className="absolute top-8 right-12 flex gap-3">
                       <span className="px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-black border border-indigo-500/20">HUMAN_LOGIC</span>
                       <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-black border border-emerald-500/20">LIVE_DATA</span>
                    </div>
                    
                    <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-sm">
                       {aiAnalysis ? (
                         <div className={`p-10 rounded-3xl border border-white/5 whitespace-pre-wrap text-slate-300 leading-relaxed border-l-8 italic shadow-2xl ${isLockedDown ? 'border-l-red-600 bg-red-950/20' : 'border-l-indigo-600 bg-white/[0.01]'}`}>
                           {aiAnalysis}
                         </div>
                       ) : (
                         <div className="py-24 flex flex-col items-center gap-6 opacity-30">
                            <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                            <span className="text-[9px] font-black tracking-[1em] uppercase text-indigo-400">Consulting Expert Logic...</span>
                         </div>
                       )}
                    </div>
                    {selectedNode && (
                      <div className="mt-12 flex gap-4">
                        <button className="flex-1 py-5 bg-red-700 hover:bg-red-600 text-white font-black uppercase text-[9px] tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95">Disconnect Hardware Asset</button>
                        <button className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase text-[9px] tracking-[0.3em] rounded-2xl transition-all active:scale-95">Log to Mainframe</button>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-500 italic">Insert Device Signature for Expert Review</p>
                 </div>
               )}
            </div>
          )}

        </div>

        {/* Operational Ticker */}
        <footer className="h-10 bg-black border-t border-white/5 flex items-center px-12 gap-12 text-[8px] font-mono text-slate-600 uppercase tracking-[0.4em] overflow-hidden relative z-20">
           <div className="flex items-center gap-3">
             <div className={`w-1.5 h-1.5 rounded-full ${isLockedDown ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
             {isLockedDown ? 'STATUS_OFFLINE_PROTECTED' : 'SYSTEM_READY_STABLE'}
           </div>
           <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                {isLockedDown ? 
                  '// OPERATIONAL_SHUTDOWN // EMERGENCY_HALT_EXECUTED // DATA_STREAM_BLOCKED // ' :
                  '// SCANNING_REAL_TIME_PACKETS... // ARP_TRUST_LEVEL_100 // NO_ROGUE_DHCP // FIREWALL_ACTIVE // '
                }
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 10px; }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: inline-block; animation: marquee 50s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
