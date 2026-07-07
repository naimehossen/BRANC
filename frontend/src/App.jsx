import { useState } from 'react'

function App() {
  const [score, setScore] = useState(0)
  const [gems, setGems] = useState(164) // ইমেজের মতো স্টার্টিং জেম কাউন্ট

  const collectGem = () => {
    setGems((prev) => prev + 1)
    setScore((prev) => prev + 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-950 to-stone-900 text-white font-serif flex flex-col items-center justify-between p-6 overflow-hidden select-none">
      
      {/* 🛠️ জেম ঘোরানোর জন্য কাস্টম সিএসএস ইনজেকশন */}
      <style>{`
        @keyframes spinDiamond {
          0% { transform: rotateY(0deg) rotateX(15deg); }
          100% { transform: rotateY(360deg) rotateX(15deg); }
        }
        .animate-gem-rotate {
          animation: spinDiamond 4s linear infinite;
        }
      `}</style>

      {/* টপ বার (ইমেজের মতো হুবহু স্কোর ও জেম কাউন্টার) */}
      <div className="w-full max-w-md flex justify-between items-start pt-4 px-2">
        {/* লেফট সাইড পাওয়ার-আপ ইন্ডিকেটর */}
        <div className="flex flex-col items-center bg-black/40 border border-amber-600/30 rounded-xl p-2 backdrop-blur-sm">
          <span className="text-xs text-red-500 font-bold animate-pulse">🧲 MAGNET</span>
          <div className="w-12 bg-stone-800 h-2 rounded-full mt-1 overflow-hidden border border-stone-700">
            <div className="bg-lime-500 h-full w-3/4"></div>
          </div>
        </div>

        {/* রাইট সাইড ওল্ড-স্কুল গোল্ডেন স্কোর বোর্ড */}
        <div className="flex flex-col space-y-1.5 font-mono text-right bg-gradient-to-r from-stone-900/80 to-black/90 p-3 rounded-xl border-2 border-amber-600/50 shadow-xl min-w-[140px]">
          <div>
            <span className="text-[10px] uppercase text-amber-500 block font-sans tracking-widest">Score</span>
            <span className="text-2xl font-black text-amber-400 tracking-wider">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="border-t border-amber-900/50 my-1"></div>
          <div className="flex items-center justify-end space-x-1">
            <span className="text-xl font-bold text-emerald-400">💎</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{gems}</span>
          </div>
        </div>
      </div>

      {/* ৩ডি জেম ডিসপ্লে এরিয়া */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full max-w-md">
        
        {/* ৩ডি জেম কন্টেইনার (CSS 3D Perspective) */}
        <div 
          onClick={collectGem}
          className="cursor-pointer active:scale-90 transition-transform duration-100 flex items-center justify-center h-72 w-full group relative"
          style={{ perspective: '1000px' }}
        >
          
          {/* জেমের নিচের গ্লো ইফেক্ট */}
          <div className="absolute w-40 h-40 bg-emerald-500/30 rounded-full blur-3xl group-hover:bg-emerald-400/40 transition-colors"></div>

          {/* কাস্টম ৩ডি ডায়মন্ড/জেম স্ট্রাকচার */}
          <div 
            className="w-32 h-32 relative animate-gem-rotate"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* ৩ডি ফেস ১: ফ্রন্ট */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-green-400 to-emerald-300 opacity-90 border-2 border-emerald-200/50 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
              style={{ transform: 'rotateY(0deg) translateZ(40px) scaleY(1.2) rotate(45deg)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            ></div>
            {/* ৩ডি ফেস ২: রাইট */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 opacity-85 border-2 border-emerald-300/40"
              style={{ transform: 'rotateY(90deg) translateZ(40px) scaleY(1.2) rotate(45deg)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            ></div>
            {/* ৩ডি ফেস ৩: ব্যাক */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 opacity-90 border-2 border-emerald-400/30"
              style={{ transform: 'rotateY(180deg) translateZ(40px) scaleY(1.2) rotate(45deg)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            ></div>
            {/* ৩ডি ফেস ৪: লেফট */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-green-500 to-emerald-600 opacity-85 border-2 border-emerald-300/40"
              style={{ transform: 'rotateY(-90deg) translateZ(40px) scaleY(1.2) rotate(45deg)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            ></div>
          </div>

          <span className="absolute bottom-4 text-xs font-sans tracking-widest text-emerald-400 font-bold uppercase bg-black/40 px-3 py-1 rounded-full border border-emerald-500/20 opacity-70 group-hover:opacity-100 transition-opacity">
            Tap Gem to Collect
          </span>
        </div>

      </main>

      {/* বটম কন্ট্রোল এবং runner ফিল */}
      <footer className="w-full max-w-md pb-6 flex flex-col items-center space-y-4">
        {/* রানিং ট্র্যাকের মতো ইফেক্ট দেওয়ার জন্য কাঠের পাটাতন বাটন */}
        <button 
          onClick={collectGem}
          className="w-11/12 py-4 bg-gradient-to-b from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 font-black text-lg tracking-widest rounded-xl border-b-8 border-amber-950 active:border-b-2 active:translate-y-[6px] shadow-2xl transition-all uppercase font-sans"
        >
          🏃‍♂️ Run & Collect
        </button>

        {/* গেম পজ বাটন (ইমেজের নিচের ডানদিকের মতো) */}
        <div className="w-full flex justify-center">
          <button className="p-3 bg-stone-900 border-2 border-stone-700 hover:border-amber-600 rounded-full shadow-lg group transition-colors">
            <div className="flex space-x-1">
              <div className="w-1.5 h-4 bg-amber-500 group-hover:bg-amber-400 rounded-sm"></div>
              <div className="w-1.5 h-4 bg-amber-500 group-hover:bg-amber-400 rounded-sm"></div>
            </div>
          </button>
        </div>
      </footer>

    </div>
  )
}

export default App
