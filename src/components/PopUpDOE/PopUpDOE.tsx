import { useState } from "react";
import { FaTimes, FaCopy, FaCheck, FaQrcode } from "react-icons/fa";

interface PopUpDOEProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const PopUpDOE = ({ visible, setVisible }: PopUpDOEProps) => {
  const [copied, setCopied] = useState(false);
  const pixKey = "46529785000195";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) setVisible(false);
      }}
    >
      <div 
        className="bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 mx-4 animate-fade-in-up"
      >
        {/* Header */}
        <div className="bg-[#222] p-4 flex justify-between items-center border-b border-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaQrcode className="text-secondary" />
                Faça sua doação
            </h3>
            <button 
                onClick={() => setVisible(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            >
                <FaTimes size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
            {/* QR Code */}
            <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl mb-3 shadow-inner">
                    <img
                        src="/img/QRcode.png"
                        alt="QR Code PIX"
                        className="w-48 h-48 object-contain"
                    />
                </div>
                <span className="text-sm text-gray-400 text-center">
                    Escaneie o QR Code com o app do seu banco
                </span>
            </div>

            {/* Pix Copy */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chave PIX (CNPJ)</label>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#252525] border border-white/10 rounded-lg p-3 text-gray-300 font-mono text-sm truncate select-all">
                        {pixKey}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className={`p-3 rounded-lg border transition-all ${
                            copied 
                            ? 'bg-green-500/10 border-green-500/50 text-green-500' 
                            : 'bg-zinc-500/10 border-zinc-500/50 text-zinc-500 hover:bg-zinc-500/20'
                        }`}
                        title="Copiar chave PIX"
                    >
                        {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                </div>
            </div>

            {/* Bank Info */}
            <div className="grid grid-cols-2 gap-4 bg-[#252525] p-4 rounded-xl border border-white/5">
                <div>
                    <span className="block text-xs text-gray-500 uppercase mb-1">Banco</span>
                    <span className="text-white font-medium">Santander (033)</span>
                </div>
                <div>
                    <span className="block text-xs text-gray-500 uppercase mb-1">Agência</span>
                    <span className="text-white font-medium">4646</span>
                </div>
                <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                    <span className="block text-xs text-gray-500 uppercase mb-1">Conta Corrente</span>
                    <span className="text-white font-medium">13004390-0</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
