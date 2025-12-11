import React, { useState } from 'react';
import { AppView } from './types';
import { QrCode, Users, Timer, Dices, ArrowLeft, GraduationCap } from 'lucide-react';
import QrTool from './features/QrTool';
import PickerTool from './features/PickerTool';
import StopwatchTool from './features/StopwatchTool';
import DiceTool from './features/DiceTool';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  const renderView = () => {
    switch (currentView) {
      case AppView.QR_GENERATOR:
        return <QrTool onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.RANDOM_PICKER:
        return <PickerTool onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.STOPWATCH:
        return <StopwatchTool onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.DICE_ROLLER:
        return <DiceTool onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.HOME:
      default:
        return <HomeDashboard onSelect={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-primary-100 selection:text-primary-700">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setCurrentView(AppView.HOME)}
          >
            <div className="bg-primary-500 text-white p-2 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-display font-bold text-slate-800 tracking-tight">
              Classroom<span className="text-primary-600">Kit</span>
            </h1>
          </div>
          {currentView !== AppView.HOME && (
            <button
              onClick={() => setCurrentView(AppView.HOME)}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors bg-slate-100 hover:bg-primary-50 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft size={16} />
              <span>홈으로</span>
            </button>
          )}
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {renderView()}
      </main>

      <footer className="text-center text-slate-400 py-8 text-sm">
        <p>© {new Date().getFullYear()} Classroom Kit. 선생님들을 위한 스마트 도구함.</p>
      </footer>
    </div>
  );
};

interface HomeDashboardProps {
  onSelect: (view: AppView) => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onSelect }) => {
  const apps = [
    {
      id: AppView.QR_GENERATOR,
      title: 'QR 생성기',
      description: '웹사이트 주소를 입력하면 학생들이 스캔할 수 있는 QR코드를 즉시 생성합니다.',
      icon: <QrCode size={32} className="text-white" />,
      color: 'bg-emerald-500',
      hoverColor: 'group-hover:bg-emerald-600',
      bgLight: 'bg-emerald-50',
    },
    {
      id: AppView.RANDOM_PICKER,
      title: '랜덤 뽑기',
      description: '엑셀 명단을 붙여넣어 발표자를 무작위로 추첨합니다. 중복 방지 기능 포함.',
      icon: <Users size={32} className="text-white" />,
      color: 'bg-blue-500',
      hoverColor: 'group-hover:bg-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      id: AppView.STOPWATCH,
      title: '스탑워치',
      description: '수업 시간 관리, 퀴즈, 활동 시간을 위한 대형 타이머. 종료 시 알림음이 울립니다.',
      icon: <Timer size={32} className="text-white" />,
      color: 'bg-amber-500',
      hoverColor: 'group-hover:bg-amber-600',
      bgLight: 'bg-amber-50',
    },
    {
      id: AppView.DICE_ROLLER,
      title: '주사위',
      description: '간단한 게임이나 순서를 정할 때 사용하는 디지털 주사위입니다.',
      icon: <Dices size={32} className="text-white" />,
      color: 'bg-rose-500',
      hoverColor: 'group-hover:bg-rose-600',
      bgLight: 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
          오늘 수업에 <span className="text-primary-600">무엇이</span> 필요하신가요?
        </h2>
        <p className="text-slate-500 text-lg">
          선생님을 위한 편리한 도구들을 한 곳에 모았습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelect(app.id)}
            className={`group relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 text-left`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 ${app.color}`}></div>
            
            <div className="flex items-start gap-5">
              <div className={`${app.color} ${app.hoverColor} transition-colors p-4 rounded-xl shadow-lg shrink-0`}>
                {app.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 font-display group-hover:text-primary-700 transition-colors">
                  {app.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {app.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;