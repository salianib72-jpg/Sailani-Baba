
import React, { useState, useRef, useEffect } from 'react';
import { generateVideoContent, generateThumbnail } from './services/geminiService';
import { VideoData, GenerationStatus, PricingPlan } from './types';
import { CopyButton } from './components/CopyButton';
import { PricingModal } from './components/PricingModal';

const COST_PER_GENERATION = 10;

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>({ loading: false, message: '' });
  const [result, setResult] = useState<VideoData | null>(null);
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('viral_studio_coins');
    return saved ? parseInt(saved) : 20; // 20 welcome coins
  });
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('viral_studio_coins', coins.toString());
  }, [coins]);

  const handlePurchase = (plan: PricingPlan) => {
    // PLACEHOLDER: Integrate Razorpay logic here
    // Example: const options = { key: 'YOUR_RAZORPAY_KEY', amount: plan.price * 100, ... }
    
    // Simulating success for now
    alert(`Redirecting to payment for ₹${plan.price}. (Razorpay Integration Ready)`);
    setCoins(prev => prev + plan.coins);
    setIsPricingOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (coins < COST_PER_GENERATION) {
      setIsPricingOpen(true);
      return;
    }

    if (!title || !image) {
      alert("Please provide both a title and a photo!");
      return;
    }

    setStatus({ loading: true, message: 'Checking credits...' });
    setResult(null);

    try {
      setStatus({ loading: true, message: 'Optimizing titles and hashtags...' });
      const videoData = await generateVideoContent(title);
      
      setStatus({ loading: true, message: 'Creating your 3D viral thumbnail...' });
      const thumbnailUrl = await generateThumbnail(image, videoData.optimizedTitle);
      
      setResult({ ...videoData, thumbnailUrl });
      setCoins(prev => prev - COST_PER_GENERATION);
      setStatus({ loading: false, message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus({ loading: false, message: '', error: 'Something went wrong. Please try again.' });
    }
  };

  const reset = () => {
    setResult(null);
    setTitle('');
    setImage(null);
    setStatus({ loading: false, message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Top Navbar / Wallet */}
      <div className="fixed top-4 right-4 z-40">
        <div className="glass neon-border rounded-2xl px-4 py-2 flex items-center space-x-3 shadow-xl border border-white/10">
          <div className="flex items-center space-x-2">
            <i className="fas fa-coins text-yellow-500 text-lg shadow-[0_0_10px_rgba(234,179,8,0.5)]"></i>
            <span className="font-black text-white text-lg">{coins}</span>
          </div>
          <button 
            onClick={() => setIsPricingOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all"
          >
            Recharge
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          ViralTube Studio AI
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          अपनी फोटो और वीडियो टाइटल दें, बाकी काम AI करेगा। वायरल थंबनेल, टैग्स और डिस्क्रिप्शन एक क्लिक में।
        </p>
        <div className="mt-4 flex justify-center items-center space-x-2 text-xs text-slate-500 font-medium">
          <span className="bg-slate-800 px-3 py-1 rounded-full border border-white/5">Cost: {COST_PER_GENERATION} Coins / Generation</span>
        </div>
      </div>

      {!result ? (
        <div className="max-w-2xl mx-auto glass neon-border rounded-3xl p-6 md:p-10">
          <form onSubmit={handleProcess} className="space-y-8">
            {/* Image Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center ${
                image ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              {image ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-semibold">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-camera text-2xl text-slate-400"></i>
                  </div>
                  <p className="text-slate-300 font-medium">Upload your main photo</p>
                  <p className="text-slate-500 text-sm mt-1">PNG, JPG or WebP supported</p>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Video Title (Hint of what your video is about)</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My first travel vlog to Paris"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>

            {/* Action Button */}
            <button
              disabled={status.loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2 ${
                status.loading 
                ? "bg-slate-700 cursor-not-allowed" 
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {status.loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{status.message}</span>
                </>
              ) : (
                <>
                  <i className={`fas ${coins < COST_PER_GENERATION ? 'fa-lock' : 'fa-magic'}`}></i>
                  <span>{coins < COST_PER_GENERATION ? 'Low Coins - Recharge Now' : 'Generate Viral Assets'}</span>
                </>
              )}
            </button>
            
            {status.error && (
              <p className="text-red-400 text-center text-sm">{status.error}</p>
            )}
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold flex items-center">
               <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
               AI Result Dashboard
            </h2>
            <button onClick={reset} className="text-slate-400 hover:text-white transition-colors">
              <i className="fas fa-redo mr-2"></i> Start New
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Thumbnail Preview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass neon-border rounded-3xl overflow-hidden group">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-300">Generated 3D Thumbnail</h3>
                  <a href={result.thumbnailUrl} download="thumbnail.png" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                    <i className="fas fa-download mr-1"></i> Download HD
                  </a>
                </div>
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img 
                    src={result.thumbnailUrl} 
                    alt="AI Generated Thumbnail" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Title & Description Card */}
              <div className="glass neon-border rounded-3xl p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Optimized Title</label>
                    <CopyButton text={result.optimizedTitle} />
                  </div>
                  <p className="text-xl font-bold text-white leading-tight">
                    {result.optimizedTitle}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Video Description</label>
                    <CopyButton text={result.description} />
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl text-slate-300 text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto border border-white/5">
                    {result.description}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Viral Hashtags</label>
                    <CopyButton text={result.hashtags.join(' ')} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, idx) => (
                      <span key={idx} className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Virality Sidebar */}
            <div className="space-y-8">
              <div className="glass neon-border rounded-3xl p-8 text-center bg-gradient-to-b from-white/5 to-transparent">
                <h3 className="text-slate-400 font-bold text-sm uppercase mb-6 tracking-widest">Virality Potential</h3>
                
                <div className="relative inline-flex items-center justify-center mb-6">
                  <svg className="w-40 h-40">
                    <circle
                      className="text-slate-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="70"
                      cx="80"
                      cy="80"
                    />
                    <circle
                      className="text-purple-500"
                      strokeWidth="10"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * result.viralityScore) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="70"
                      cx="80"
                      cy="80"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-white">{result.viralityScore}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Likelihood</span>
                  </div>
                </div>

                <div className="bg-purple-500/20 rounded-2xl p-4 border border-purple-500/30">
                  <p className="text-sm italic text-purple-200 leading-relaxed">
                    "{result.viralityAnalysis}"
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                <h4 className="font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2"></i> Quick Tips
                </h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                    Post between 6 PM - 9 PM for maximum reach.
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                    Pinned comments increase engagement by 40%.
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                    The 3D thumbnail style generated is currently trending.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recharge Modal */}
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        onPurchase={handlePurchase}
      />

      {/* Footer */}
      <div className="mt-20 py-8 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>© 2024 ViralTube AI Studio. Powered by Gemini AI.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
        </div>
      </div>
    </div>
  );
};

export default App;
