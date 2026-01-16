import { useState, useEffect } from 'react';
import { Monitor, Command, Skull, Maximize } from 'lucide-react';

function App() {
  const [system, setSystem] = useState(null); // 'macos' | 'win10' | 'bsod'
  const [progress, setProgress] = useState(0);
  
  // 进入全屏
  const enterFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen failed:", e);
    }
  };

  // 退出全屏
  const exitFullScreen = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // ✅ 核心逻辑补全：监听全屏状态变化 (保持状态同步)
  // 无论用户按 ESC、F11 还是切换窗口，只要退出全屏，就重置状态
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setSystem(null);
        setProgress(0);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 模拟逻辑
  useEffect(() => {
    if (!system) return;

    // BSOD 不需要进度条逻辑
    if (system === 'bsod') {
        const handleEsc = (e) => { if (e.key === 'Escape') exitFullScreen(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }

    // 设置初始随机进度
    setProgress(Math.floor(Math.random() * 10));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99;
        const increment = Math.random() > 0.8 ? 1 : 0; 
        return prev + increment;
      });
    }, 2000);

    const handleEsc = (e) => {
      if (e.key === 'Escape') exitFullScreen();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [system]);

  const startSimulation = (sysType) => {
    setSystem(sysType);
    enterFullScreen();
  };

  // 1. macOS 界面 (立即显示，无淡入)
  if (system === 'macos') {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center cursor-none select-none">
        <img src="/apple.svg" alt="Apple Logo" className="w-24 h-24 mb-16 opacity-90" />
        <div className="w-72 h-1.5 bg-[#333] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#b3b3b3] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // 2. Windows 10 更新界面 (立即显示，无淡入)
  if (system === 'win10') {
    return (
      <div className="w-full h-screen bg-[#006dae] flex flex-col items-center justify-center cursor-none font-['Segoe_UI'] select-none">
        <div className="w-16 h-16 border-4 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mb-8 opacity-90"></div>
        <div className="text-white text-2xl font-light mb-2">Working on updates {progress}%</div>
        <div className="text-white text-2xl font-light">Don't turn off your PC. This will take a while.</div>
        <div className="fixed bottom-8 text-white/40 text-sm">Your PC will restart several times</div>
      </div>
    );
  }

  // 3. BSOD 蓝屏界面 (立即显示，无淡入)
  if (system === 'bsod') {
    return (
      <div className="w-full h-screen bg-[#0078d7] p-20 md:p-40 cursor-none font-['Segoe_UI'] text-white select-none flex flex-col justify-center">
        <div className="text-[100px] md:text-[150px] leading-none mb-10">:(</div>
        <h2 className="text-2xl md:text-4xl font-light mb-8">
            Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
        </h2>
        <div className="text-xl md:text-2xl mb-12">
            20% complete
        </div>
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white p-2">
                <div className="w-full h-full bg-black opacity-80 grid grid-cols-4 gap-0.5">
                    {[...Array(16)].map((_,i) => <div key={i} className={`bg-black ${Math.random()>0.5?'opacity-100':'opacity-0'}`}></div>)}
                </div>
            </div>
            <div className="text-sm md:text-base space-y-1">
                <p>For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
                <p>If you call a support person, give them this info:</p>
                <p>Stop code: CRITICAL_PROCESS_DIED</p>
            </div>
        </div>
      </div>
    );
  }

  // 4. 首页选择器
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans select-none">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
        Moyu Simulator
      </h1>
      <p className="text-slate-400 mb-12 text-center">Fake upgrade screens to keep your boss away.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button onClick={() => startSimulation('macos')} className="group bg-black border border-slate-800 p-8 rounded-2xl hover:border-slate-600 transition-all hover:scale-105 flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20">
            <Command className="text-white" />
          </div>
          <span className="text-white font-medium">macOS Update</span>
        </button>

        <button onClick={() => startSimulation('win10')} className="group bg-[#006dae] p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(0,109,174,0.4)] transition-all hover:scale-105 flex flex-col items-center gap-4 border border-transparent">
          <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20">
            <Monitor className="text-white" />
          </div>
          <span className="text-white font-medium">Windows 10</span>
        </button>

        <button onClick={() => startSimulation('bsod')} className="group bg-[#0078d7] p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(0,120,215,0.4)] transition-all hover:scale-105 flex flex-col items-center gap-4 border border-transparent">
          <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20">
            <Skull className="text-white" />
          </div>
          <span className="text-white font-medium">Blue Screen</span>
        </button>
      </div>

      <div className="mt-16 flex items-center gap-2 text-slate-600 text-sm">
        <Maximize size={14}/>
        <span>Press <strong>ESC</strong> to exit simulation</span>
      </div>
    </div>
  );
}

export default App;