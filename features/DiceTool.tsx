import React, { useState } from 'react';
import { Dices } from 'lucide-react';

interface DiceToolProps {
  onBack: () => void;
}

const DiceTool: React.FC<DiceToolProps> = ({ onBack }) => {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Play rolling sound if available, or just animate
    const rollDuration = 1000;
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      elapsed += intervalTime;
      if (elapsed >= rollDuration) {
        clearInterval(interval);
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        setIsRolling(false);
      }
    }, intervalTime);
  };

  const renderDots = (value: number) => {
    const dots = [];
    // Positions for dots based on standard dice face
    // Grid is 3x3. Indices 0-8.
    // 0 1 2
    // 3 4 5
    // 6 7 8
    
    let activeIndices: number[] = [];
    switch(value) {
        case 1: activeIndices = [4]; break;
        case 2: activeIndices = [0, 8]; break; // or 2, 6
        case 3: activeIndices = [0, 4, 8]; break;
        case 4: activeIndices = [0, 2, 6, 8]; break;
        case 5: activeIndices = [0, 2, 4, 6, 8]; break;
        case 6: activeIndices = [0, 2, 3, 5, 6, 8]; break;
    }

    for (let i = 0; i < 9; i++) {
        dots.push(
            <div 
                key={i} 
                className={`dot ${activeIndices.includes(i) ? 'opacity-100' : 'opacity-0'}`} 
            />
        );
    }
    return dots;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">주사위 굴리기</h2>
        <p className="text-slate-500 mt-2">화면을 클릭하여 주사위를 굴리세요.</p>
      </div>

      <div className="bg-white p-12 rounded-3xl shadow-lg border border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
        
        <button 
            onClick={rollDice}
            disabled={isRolling}
            className={`
                w-48 h-48 bg-white border-4 border-slate-800 rounded-3xl shadow-[12px_12px_0px_0px_rgba(30,41,59,1)] 
                transition-all duration-200 
                ${isRolling ? 'animate-bounce cursor-wait' : 'hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] active:translate-y-3 active:shadow-none'}
            `}
        >
            <div className="dice-face w-full h-full">
                {renderDots(diceValue)}
            </div>
        </button>

        <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm mb-4">
                {isRolling ? "굴러가는 중..." : "주사위를 클릭하세요!"}
            </p>
            <button
                onClick={rollDice}
                disabled={isRolling}
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-200 transition-colors flex items-center gap-2 mx-auto"
            >
                <Dices size={20} />
                굴리기
            </button>
        </div>

      </div>
    </div>
  );
};

export default DiceTool;