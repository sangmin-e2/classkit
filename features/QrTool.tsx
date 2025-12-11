import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Link, Download, Copy, Check } from 'lucide-react';

interface QrToolProps {
  onBack: () => void;
}

const QrTool: React.FC<QrToolProps> = ({ onBack }) => {
  const [url, setUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">QR 코드 생성기</h2>
        <p className="text-slate-500 mt-2">URL을 입력하면 실시간으로 QR 코드가 생성됩니다.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center space-y-8">
        <div className="w-full relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Link size={20} />
            </div>
            <input
                type="text"
                placeholder="https://www.example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg"
            />
            {url && (
                <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="URL 복사"
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            )}
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[300px] w-full">
            {url ? (
                <>
                    <div className="bg-white p-4 shadow-lg rounded-xl">
                         <QRCode
                            value={url}
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                            />
                    </div>
                    <p className="mt-6 text-sm text-slate-400 font-medium break-all max-w-sm text-center">
                        {url}
                    </p>
                </>
            ) : (
                <div className="text-center text-slate-300">
                    <div className="mb-4 flex justify-center">
                        <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Link size={40} />
                        </div>
                    </div>
                    <p>URL을 입력하여 QR 코드를 생성하세요</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QrTool;