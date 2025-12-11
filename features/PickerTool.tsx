import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, UserPlus, CheckCircle, Trash2 } from 'lucide-react';

interface PickerToolProps {
  onBack: () => void;
}

const PickerTool: React.FC<PickerToolProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [remainingNames, setRemainingNames] = useState<string[]>([]);
  const [currentPick, setCurrentPick] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Parse names when input text changes
  const handleParseNames = () => {
    // Split by new line, trim whitespace, remove empty strings
    const nameList = inputText
      .split(/\n/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    // Remove duplicates
    const uniqueNames = Array.from(new Set(nameList));
    
    setNames(uniqueNames);
    setRemainingNames(uniqueNames);
    setHistory([]);
    setCurrentPick(null);
  };

  const pickRandom = () => {
    if (remainingNames.length === 0) return;

    setIsAnimating(true);
    let counter = 0;
    const maxIterations = 20;
    
    const interval = setInterval(() => {
      // Animation effect: show random names quickly
      const randomIndex = Math.floor(Math.random() * remainingNames.length);
      setCurrentPick(remainingNames[randomIndex]);
      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        finalizePick();
      }
    }, 50);
  };

  const finalizePick = () => {
    const randomIndex = Math.floor(Math.random() * remainingNames.length);
    const picked = remainingNames[randomIndex];
    
    setCurrentPick(picked);
    setHistory(prev => [picked, ...prev]);
    setRemainingNames(prev => prev.filter((_, i) => i !== randomIndex));
    setIsAnimating(false);
  };

  const reset = () => {
    setRemainingNames([...names]);
    setHistory([]);
    setCurrentPick(null);
  };

  const clearAll = () => {
    setInputText('');
    setNames([]);
    setRemainingNames([]);
    setHistory([]);
    setCurrentPick(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">랜덤 뽑기</h2>
        <p className="text-slate-500 mt-2">발표자나 당번을 공정하게 뽑아보세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
            <label className="flex items-center gap-2 font-bold text-slate-700 mb-3">
              <UserPlus size={20} className="text-blue-500" />
              명단 입력
            </label>
            <textarea
              className="flex-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm leading-relaxed"
              placeholder="엑셀에서 명단을 복사하여 여기에 붙여넣으세요.&#13;&#10;(한 줄에 한 명)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleParseNames}
                disabled={!inputText.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors shadow-md shadow-blue-200"
              >
                명단 등록 ({names.length}명)
              </button>
              <button 
                onClick={clearAll}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="초기화"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Display Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Stage */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {names.length === 0 ? (
              <div className="text-slate-300 relative z-10">
                <Shuffle size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">왼쪽에 명단을 입력하고 등록해주세요</p>
              </div>
            ) : (
              <div className="relative z-10 w-full">
                <div className="mb-2 text-sm font-medium text-slate-400 uppercase tracking-wider">
                  {remainingNames.length > 0 ? 'Who is next?' : '모든 인원 선택 완료!'}
                </div>
                
                <div className={`text-5xl md:text-7xl font-display font-black transition-all duration-200 ${isAnimating ? 'scale-110 text-blue-400 blur-[2px]' : 'scale-100 text-slate-800'}`}>
                  {currentPick || "Ready?"}
                </div>

                <div className="mt-12 flex justify-center gap-4">
                  <button
                    onClick={pickRandom}
                    disabled={isAnimating || remainingNames.length === 0}
                    className="group relative px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-3"
                  >
                    <Shuffle size={24} className={isAnimating ? 'animate-spin' : ''} />
                    <span>{remainingNames.length === 0 ? '완료' : '추첨하기'}</span>
                  </button>
                  
                  <button
                    onClick={reset}
                    disabled={isAnimating || history.length === 0}
                    className="px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-medium transition-colors"
                    title="다시 시작 (명단 유지)"
                  >
                    <RotateCcw size={24} />
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-slate-400">
                  남은 인원: <span className="font-bold text-blue-500">{remainingNames.length}</span> / {names.length}
                </div>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                선택된 명단 ({history.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {history.map((name, idx) => (
                  <span 
                    key={`${name}-${idx}`} 
                    className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-sm animate-fade-in"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-xs flex items-center justify-center mr-2">
                        {names.length - remainingNames.length - idx}
                    </span>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickerTool;