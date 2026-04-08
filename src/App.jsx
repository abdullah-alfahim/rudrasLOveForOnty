import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Gamepad2, Gift, Smile, Send, Sparkles, Star, RefreshCw } from 'lucide-react';
import './App.css';

const SELECTED_QUESTIONS = [
  "Does Rudra really love me?",
  "What should I do when I miss Rudra too much?",
  "How do I know if Rudra misses me too?",
  "Why does thinking about Rudra make me smile for no reason?",
  "What does it mean if I miss Rudra even when we just talked?",
  "Is it normal to want to talk to Rudra all the time?",
  "How can I make Rudra feel loved?",
  "Why does Rudra feel like home to me?"
];

const LOCAL_REPLIES = {
  "does rudra really love me?": "If Rudra consistently cares about your feelings, checks on you, and makes time for you, then yes-his actions likely show genuine love.",
  "what should i do when i miss rudra too much?": "Remind yourself of your favorite memories together, text him something sweet, or plan your next moment together.",
  "how do i know if rudra misses me too?": "If he texts/calls unexpectedly, asks how you are, or notices when you're distant, he probably misses you deeply.",
  "why does thinking about rudra make me smile for no reason?": "Because your heart associates him with comfort, happiness, and emotional safety.",
  "what does it mean if i miss rudra even when we just talked?": "It usually means he has become an important emotional part of your day.",
  "is it normal to want to talk to rudra all the time?": "Yes-when someone matters to you deeply, their presence becomes addictive in the sweetest way.",
  "how can i make rudra feel loved?": "Show appreciation, support his goals, and remind him how much he means to you.",
  "why does rudra feel like home to me?": "Because emotional connection can make a person feel like your safest place.",
  "[mood: spicy] i'm feeling a bit angry/spicy right now. be extra sweet and patient with me.": "I am sorry, my queen. I am listening and I want to make it right with extra hugs and patience. 💗",
  "[mood: soft] i'm feeling a bit sad and need a virtual hug.": "Come here, honey. You are safe with me, and I am proud of you for sharing your heart. 🧸☁️",
  "[mood: glowing] i'm feeling happy and loved! let's talk!": "That makes me so happy, my love. Keep shining like this because your joy is beautiful. 💖✨"
};

const FALLBACK_REPLIES = [
  "I love hearing from you, Onty. Pick one of the quick questions and I will answer right away. 💖",
  "I am here, my love. Tap a selected question below and I will reply instantly. ✨",
  "Your message made me smile, Bubs. Try a quick question so I can answer perfectly. 🌸"
];

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi Onty! 💖 I've been thinking about you all day. How are you feeling, my love?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loveMeter, setLoveMeter] = useState(0);
  const [sparks, setSparks] = useState([]);
  const [reward, setReward] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const LOVE_REWARDS = [
    "Coupon: Good for ONE endless cuddle session! 🧸",
    "Reminder: Rudra loves you more than anything in this world! 🌍💖",
    "Coupon: One free 'Rudra says sorry and buys you food' ticket! 🍕",
    "Secret: You are the most beautiful girl in the universe! ✨",
    "Coupon: 100 kisses anywhere you want! 😘",
    "Coupon: A romantic date night planned by Rudra! 🌹",
    "Truth: My heart beats only for you, Onty! 💓"
  ];

  // --- Smooth Scrolling ---
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  // --- Local Reply Logic ---
  const getLocalReply = async (messageText) => {
    setIsTyping(true);
    const normalized = messageText.trim().toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 550));
    setIsTyping(false);
    if (LOCAL_REPLIES[normalized]) return LOCAL_REPLIES[normalized];

    const randomIndex = Math.floor(Math.random() * FALLBACK_REPLIES.length);
    return FALLBACK_REPLIES[randomIndex];
  };

  const handleSendMessage = async (textOverride) => {
    const textToSend = (textOverride ?? inputText).trim();
    if (!textToSend) return;

    const userMsg = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');

    // Refocus after sending
    setTimeout(() => inputRef.current?.focus(), 10);

    const aiResponse = await getLocalReply(textToSend);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  };

  // --- Game Logic: Onty's Love Jar ---
  const spawnSpark = () => {
    setLoveMeter(currentMeter => {
       if (currentMeter >= 100) return currentMeter; // Don't spawn if full
       
       const id = Date.now();
       const x = Math.random() * 80 + 10;
       const type = Math.random() > 0.5 ? '✨' : '💖';
       setSparks(prev => [...prev, { id, x, type }]);
       setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 3500);
       
       return currentMeter;
    });
  };

  const catchSpark = (id) => {
    setSparks(prev => prev.filter(s => s.id !== id));
    setLoveMeter(prev => {
      const newMeter = prev + 10;
      if (newMeter >= 100 && !reward) {
         setReward(LOVE_REWARDS[Math.floor(Math.random() * LOVE_REWARDS.length)]);
         setSparks([]); // clear
      }
      return newMeter;
    });
  };

  const resetGame = () => {
    setLoveMeter(0);
    setReward(null);
  };

  useEffect(() => {
    if (activeTab === 'games' && loveMeter < 100) {
      const interval = setInterval(spawnSpark, 800);
      return () => clearInterval(interval);
    }
  }, [activeTab, loveMeter]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden font-sans select-none custom-app-container">
      {/* Dynamic Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-rose-100/40 rounded-full blur-3xl -z-10 pulse-bg" />
      <div className="absolute bottom-[-5%] right-[-5%] w-64 h-64 bg-pink-100/40 rounded-full blur-3xl -z-10 pulse-bg" style={{ animationDelay: '2s' }} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full overflow-y-auto chat-scroll-area">
          
          {/* HOME VIEW */}
          {activeTab === 'home' && (
            <div className="flex flex-col items-center p-6 space-y-8 tab-transition">
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight">Onty's Corner</h1>
                  <Sparkles className="absolute -top-4 -right-6 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-pink-400 font-medium italic">"The world is better with you in it."</p>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl w-full max-w-sm border border-pink-50 space-y-6">
                <h2 className="text-xl font-bold text-center text-gray-700">How's my girl today?</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Spicy', icon: '😤', color: 'bg-red-50 text-red-500 border-red-100', prompt: "I'm feeling a bit angry/spicy right now. Be extra sweet and patient with me." },
                    { label: 'Soft', icon: '🥺', color: 'bg-blue-50 text-blue-500 border-blue-100', prompt: "I'm feeling a bit sad and need a virtual hug." },
                    { label: 'Glowing', icon: '🥰', color: 'bg-pink-50 text-pink-500 border-pink-100', prompt: "I'm feeling happy and loved! Let's talk!" },
                  ].map((m) => (
                    <button
                      key={m.label}
                      onClick={async () => {
                        setActiveTab('chat');
                        await handleSendMessage(`[Mood: ${m.label}] ${m.prompt}`);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all active:scale-90 hover:shadow-md ${m.color}`}
                    >
                      <span className="text-4xl mb-2">{m.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-tight">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-sm bg-gradient-to-r from-pink-400 to-rose-400 p-5 rounded-3xl shadow-lg text-white transform transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-bold opacity-90">Daily Love Note</p>
                    <p className="text-sm">You're doing amazing, Onty. I'm so proud of you! 💖</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAT VIEW */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full bg-gradient-to-b from-rose-50/70 via-pink-50/40 to-white relative tab-transition">
              <div className="p-4 border-b border-pink-100/80 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white shadow-inner ring-4 ring-pink-100/80">
                    <Heart fill="currentColor" size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-800 tracking-tight">Rudra's Wife</h2>
                    <p className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1 leading-none mt-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Thinking of you
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setMessages([{ role: 'assistant', content: "Back again! 💖 What's on your mind?" }])} 
                  className="h-10 w-10 rounded-full bg-pink-50 border border-pink-100 text-pink-500 hover:bg-pink-100 transition-all flex items-center justify-center"
                  title="Reset chat"
                >
                    <RefreshCw size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 chat-scroll-area">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[86%] px-4 py-3 rounded-[1.5rem] shadow-sm text-[13px] leading-relaxed backdrop-blur-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-md font-medium shadow-pink-200/60' 
                        : 'bg-white/95 text-gray-800 rounded-tl-md border border-pink-100/80'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="bg-white/95 border border-pink-100 px-4 py-3 rounded-2xl rounded-tl-md flex gap-1.5 items-center shadow-sm">
                      <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 pb-7 bg-white/92 border-t border-pink-100 backdrop-blur-md">
                <div className="max-w-md mx-auto mb-2 px-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pink-400">Quick Questions</p>
                </div>
                <div className="max-w-md mx-auto mb-3 flex gap-2 overflow-x-auto pb-1 chat-scroll-area">
                  {SELECTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSendMessage(question)}
                      className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
                <div className="max-w-md mx-auto relative flex items-end gap-2 bg-gradient-to-r from-white to-pink-50/60 rounded-[1.6rem] p-2 border border-pink-200/80 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all shadow-sm">
                  <textarea
                    ref={inputRef}
                    rows="1"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Tell me everything..."
                    className="flex-1 bg-transparent border-none rounded-2xl px-3 py-2.5 text-sm focus:ring-0 outline-none resize-none max-h-32"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputText.trim()}
                    className="h-11 w-11 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:brightness-105 transition-all disabled:opacity-35 disabled:grayscale shadow-md active:scale-90 flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GAMES VIEW - ONTY'S LOVE JAR */}
          {activeTab === 'games' && (
            <div className="flex flex-col h-full overflow-hidden relative bg-gradient-to-b from-rose-50 to-white tab-transition">
              <div className="p-8 text-center space-y-1 z-10">
                <h2 className="text-3xl font-black text-pink-600 uppercase tracking-tighter italic">Onty's Love Jar</h2>
                <p className="text-sm text-pink-400 font-bold">Catch the magic sparks to fill the jar!</p>
              </div>

              {!reward ? (
                <>
                  <div className="flex-1 flex flex-col items-center justify-center relative z-10 pointer-events-none mt-4">
                     <div className="w-32 h-48 border-4 border-pink-200 rounded-b-3xl rounded-t-lg relative overflow-hidden bg-white/40 backdrop-blur-sm shadow-[0_0_30px_rgba(244,114,182,0.2)]">
                        <div className="absolute -top-1 left-[-4px] right-[-4px] h-4 bg-pink-300 rounded-sm z-20"></div>
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-400 to-rose-300 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                          style={{ height: `${loveMeter}%` }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle,white_3px,transparent_3.5px)] bg-[length:18px_24px] animate-pulse"></div>
                        </div>
                     </div>
                     <div className="mt-6 px-4 py-1.5 bg-pink-100 rounded-full border border-pink-200 shadow-sm">
                        <p className="font-black text-pink-500 text-sm">{loveMeter}% Filled with Love</p>
                     </div>
                  </div>

                  <div className="absolute inset-0 overflow-hidden pointer-events-auto">
                    {sparks.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => catchSpark(s.id)}
                        className="absolute text-4xl transition-transform active:scale-150 hover:scale-110 drop-shadow-md"
                        style={{ 
                          left: `${s.x}%`, 
                          top: '70%',
                          animation: 'float-spark 3.5s ease-out forwards'
                        }}
                      >
                        {s.type}
                      </button>
                    ))}
                    {sparks.length === 0 && loveMeter === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-pink-300/50 p-10 text-center pointer-events-none mt-20">
                            <Sparkles size={40} className="mb-2"/>
                            <p className="font-medium text-sm">Tap the sparks to collect them!</p>
                        </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 animate-in zoom-in duration-500">
                  <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-pink-100 text-center space-y-6 w-full max-w-[90%] transform hover:scale-[1.02] transition-transform">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner relative">
                      <Gift size={48} className="text-pink-600 animate-bounce relative z-10" />
                      <Sparkles className="absolute top-0 right-0 text-yellow-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 leading-tight">You Unlocked a<br/>Love Reward!</h3>
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-2xl border border-pink-100 relative mt-2">
                      <span className="text-4xl absolute -top-4 -left-2 opacity-20">"</span>
                      <p className="text-lg font-bold text-pink-600 italic relative z-10">
                        {reward}
                      </p>
                      <span className="text-4xl absolute -bottom-8 -right-2 opacity-20">"</span>
                    </div>
                    <button 
                      onClick={resetGame}
                      className="w-full py-3.5 mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} /> Fill Jar Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SURPRISE VIEW */}
          {activeTab === 'surprises' && (
            <div className="p-6 flex flex-col items-center space-y-8 tab-transition">
              <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-pink-50 transform hover:rotate-1 transition-transform">
                <div className="h-56 bg-gradient-to-br from-pink-400 to-rose-300 flex items-center justify-center relative overflow-hidden">
                  <Gift size={80} className="text-white animate-bounce relative z-10" />
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-full" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Star size={12} fill="currentColor" /> Exclusive Gift
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-tight">A Secret Note Just For My Onty</h3>
                  <p className="text-gray-600 leading-relaxed italic font-medium">
                    "kutta onek besi valobasi tore ami,,,jni onek valo kisu deserve koros,,kintu valo tore ami e basi,,,kuttao jabi na amre chaira" 💖
                  </p>
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>By: Rudra</span>
                    <span>Date: Forever</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modern Navigation Bar */}
      <nav className="h-24 bg-white/95 backdrop-blur-xl border-t border-pink-50 px-8 flex items-center justify-between pb-6 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        {[
          { id: 'home', icon: Smile, label: 'Home' },
          { id: 'chat', icon: MessageCircle, label: 'Chat' },
          { id: 'games', icon: Gamepad2, label: 'Play' },
          { id: 'surprises', icon: Gift, label: 'Gift' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center space-y-1.5 transition-all relative ${
              activeTab === item.id ? 'text-pink-600 scale-110' : 'text-gray-400 hover:text-pink-300'
            }`}
          >
            {activeTab === item.id && (
                <div className="absolute -top-3 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
            )}
            <item.icon size={26} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;