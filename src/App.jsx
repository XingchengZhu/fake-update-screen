import { useState, useEffect, useRef } from 'react';
import { Monitor, Command, XCircle, Maximize } from 'lucide-react';

function App() {
  const [system, setSystem] = useState(null); // 'macos' | 'win10' | 'win11' | null
  const [progress, setProgress] = useState(0);
  
  // 进入全屏逻辑
  const enterFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen failed:", e);
    }
  };

  // 退出全屏逻辑
  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setSystem(null);
    setProgress(0);
  };

  // 模拟进度条缓慢增长
  useEffect(() => {
    if (!system) return;

    // 初始随机进度
    setProgress(Math.floor(Math.random() * 10));

    const interval = setInterval(() => {
      setProgress((prev) => {
        // 99% 时卡住
        if (prev >= 99) return 99;
        
        // 随机增加进度，有时快有时慢，模仿真实更新
        const increment = Math.random() > 0.8 ? 1 : 0; 
        return prev + increment;
      });
    }, 2000); // 每2秒尝试更新一次

    // 监听 ESC 退出
    const handleEsc = (e) => {
      if (e.key === 'Escape') exitFullScreen();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [system]);

  // 开始模拟
  const startSimulation = (sysType) => {
    setSystem(sysType);
    enterFullScreen();
  };

  // 渲染 macOS 界面
  if (system === 'macos') {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center cursor-none">
        <img src="/apple.svg" alt="Apple Logo" className="w-24 h-24 mb-16 opacity-90" />
        {/* iOS/macOS 风格进度条 */}
        <div className="w-72 h-1.5 bg-[#333] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#b3b3b3] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* 隐藏的退出提示 */}
        <div className="fixed bottom-10 opacity-0 hover:opacity-50 transition-opacity text-gray-500 text-sm font-mono">
          Press ESC to exit
        </div>
      </div>
    );
  }

  // 渲染 Windows 10 界面
  if (system === 'win10') {
    return (
      <div className="w-full h-screen bg-[#006dae] flex flex-col items-center justify-center cursor-none font-['Segoe_UI']">
        {/* Loading Spinner */}
        <div className="w-16 h-16 border-4 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mb-8 opacity-90"></div>
        
        <div className="text-white text-2xl font-light mb-2">
          Working on updates {progress}%
        </div>
        <div className="text-white text-2xl font-light">
          Don't turn off your PC. This will take a while.
        </div>
        
        <div className="fixed bottom-8 text-white/40 text-sm">
          Your PC will restart several times
        </div>
      </div>
    );
  }

  // 默认：选择界面
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
        Moyu Simulator
      </h1>
      <p className="text-slate-400 mb-12">Select your operating system to start slacking off.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* macOS Card */}
        <button 
          onClick={() => startSimulation('macos')}
          className="group relative bg-black border border-slate-800 p-8 rounded-2xl hover:border-slate-600 transition-all hover:scale-105 flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Command className="text-white w-8 h-8" />
          </div>
          <span className="text-xl font-medium text-white">macOS Update</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">Safe & Slow</span>
        </button>

        {/* Windows Card */}
        <button 
          onClick={() => startSimulation('win10')}
          className="group relative bg-[#006dae] p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(0,109,174,0.4)] transition-all hover:scale-105 flex flex-col items-center gap-4 border border-transparent"
        >
          <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
            <Monitor className="text-white w-8 h-8" />
          </div>
          <span className="text-xl font-medium text-white">Windows 10</span>
          <span className="text-xs text-white/60 uppercase tracking-widest">The Classic Freeze</span>
        </button>
      </div>

      <div className="mt-12 text-slate-600 text-sm flex items-center gap-2">
        <Maximize size={14}/>
        <span>Screens will go <strong>FullScreen</strong> automatically. Press <strong>ESC</strong> to return.</span>
      </div>
    </div>
  );
}

export default App;