import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

interface StopwatchToolProps {
  onBack: () => void;
}

const StopwatchTool: React.FC<StopwatchToolProps> = ({ onBack }) => {
  const [inputMinutes, setInputMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
  const [initialTime, setInitialTime] = useState<number>(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const presets = [1, 3, 5, 10, 30, 60];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      setIsFinished(true);
      playAlarm();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Audio setup
  useEffect(() => {
    // A pleasant notification sound
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-school-bell-alarm-3240.mp3'); 
    // Fallback or better sound could be used. Using a generic CDN for demo purposes. 
    // Alternate: https://actions.google.com/sounds/v1/alarms/beep_short.ogg
    audioRef.current.volume = 0.5;
  }, []);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsFinished(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsFinished(false);
    stopAlarm();
    setTimeLeft(initialTime);
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      handleReset();
    }
    setIsActive(true);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsActive(false);
    stopAlarm();
  };

  const setPreset = (mins: number) => {
    setInputMinutes(mins);
    const seconds = mins * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
    setIsFinished(false);
    stopAlarm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= 180) {
      setInputMinutes(val);
      const seconds = val * 60;
      setInitialTime(seconds);
      setTimeLeft(seconds);
      setIsActive(false);
      setIsFinished(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  const isDanger = timeLeft <= 60 && timeLeft > 0; // Last minute

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">타이머</h2>
        <p className="text-slate-500 mt-2">수업 활동 시간을 관리하세요.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
        
        {/* Presets */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {presets.map(min => (
            <button
              key={min}
              onClick={() => setPreset(min)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                inputMinutes === min 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200 scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {min}분
            </button>
          ))}
          <div className="flex items-center gap-2 bg-slate-50 px-3 rounded-full border border-slate-200">
             <input 
                type="number" 
                value={inputMinutes}
                onChange={handleInputChange}
                className="w-12 bg-transparent text-center font-bold text-slate-700 outline-none"
             />
             <span className="text-sm text-slate-500">분</span>
          </div>
        </div>

        {/* Display */}
        <div className="relative flex justify-center items-center py-10">
          {/* Progress Ring (SVG) */}
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-slate-100 fill-none"
                strokeWidth="12"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className={`fill-none transition-all duration-1000 ease-linear ${
                   isFinished ? 'stroke-red-500 animate-pulse' : 
                   isDanger ? 'stroke-red-400' : 'stroke-amber-400'
                }`}
                strokeWidth="12"
                strokeDasharray="283%" // Approx circumference
                strokeDashoffset={`${283 - (progress * 2.83)}%`}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-7xl md:text-9xl font-display font-bold tabular-nums tracking-tighter ${
                    isFinished ? 'text-red-500 animate-bounce' : 
                    isDanger ? 'text-red-500' : 'text-slate-800'
                }`}>
                    {formatTime(timeLeft)}
                </div>
                {isFinished && (
                    <div className="mt-4 text-red-500 font-bold text-xl flex items-center gap-2 animate-pulse">
                        <Bell className="animate-wiggle" /> 시간 종료!
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6 mt-6">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-amber-200 transition-all active:scale-95"
            >
              <Play fill="currentColor" /> {timeLeft === 0 ? '다시 시작' : '시작'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-10 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-95"
            >
              <Pause fill="currentColor" /> 일시정지
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors"
            title="초기화"
          >
            <RotateCcw size={28} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default StopwatchTool;