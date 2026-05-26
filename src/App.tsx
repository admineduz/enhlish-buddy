// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Star, Mic } from 'lucide-react';

// --- INJECT STYLES & TAILWIND ---
const injectSetup = () => {
  if (!document.getElementById('tailwind-cdn')) {
    const script = document.createElement('script');
    script.id = 'tailwind-cdn';
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
  }
  if (!document.getElementById('custom-styles')) {
    const style = document.createElement('style');
    style.id = 'custom-styles';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&display=swap');
      body {
        font-family: 'Quicksand', system-ui, -apple-system, sans-serif;
        background-color: #f8fafc;
        background-image: radial-gradient(circle at 100% 0%, #e0e7ff 0%, transparent 50%),
                          radial-gradient(circle at 0% 100%, #fae8ff 0%, transparent 50%);
        background-attachment: fixed;
      }
      .bounce-anim { animation: float 3s ease-in-out infinite; }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .mic-ripple { animation: ripple 1.5s linear infinite; }
      @keyframes ripple {
        0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
        70% { box-shadow: 0 0 0 25px rgba(244, 63, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
      }
      .modern-bubble {
        background: #ffffff; border: 2px solid #e2e8f0; border-radius: 1.5rem;
        position: relative; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      }
      .modern-bubble::after {
        content: ''; position: absolute; bottom: -11px; left: 50%; transform: translateX(-50%);
        border-width: 11px 11px 0; border-style: solid; border-color: #e2e8f0 transparent transparent transparent;
      }
      .modern-bubble::before {
        content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
        border-width: 10px 10px 0; border-style: solid; border-color: #ffffff transparent transparent transparent; z-index: 1;
      }
      .roadmap-line {
        position: absolute; left: 2.25rem; top: 2rem; bottom: 2rem; width: 4px;
        background: linear-gradient(to bottom, #3b82f6, #a855f7, #f59e0b);
        border-radius: 4px; z-index: 0; opacity: 0.3;
      }
      .btn-3d { transition: all 0.1s ease; }
      .btn-3d:active { transform: translateY(4px); border-bottom-width: 0px !important; margin-top: 4px; }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
      .animate-shake { animation: shake 0.5s ease-in-out; }
    `;
    document.head.appendChild(style);
  }
};

// --- DATA: CURRICULUM ---
const courseData = {
  level1: {
    name: "Từ Vựng Cốt Lõi", color: "blue",
    topics: [
      { id: 'characters', icon: '🤴', name: 'Nhân Vật', words: [
        { type: 'vocab', word: "KNIGHT", vi: "Hiệp sĩ", context_en: "The brave knight.", context_vi: "Chàng hiệp sĩ dũng cảm." },
        { type: 'vocab', word: "KING", vi: "Nhà vua", context_en: "The king stands up.", context_vi: "Nhà vua đứng dậy." }
      ]},
      { id: 'objects', icon: '⛺', name: 'Đồ Vật', words: [
        { type: 'vocab', word: "TENT", vi: "Cái lều", context_en: "A red tent.", context_vi: "Một cái lều màu đỏ." },
        { type: 'vocab', word: "CUP", vi: "Chiếc cúp", context_en: "A shiny gold cup.", context_vi: "Chiếc cúp vàng sáng bóng." },
        { type: 'vocab', word: "LANCE", vi: "Cây thương", context_en: "His lance gets stuck.", context_vi: "Cây thương của anh ấy bị kẹt." }
      ]}
    ]
  },
  level2: {
    name: "Ngữ Âm Chuyên Sâu", color: "purple",
    topics: [
      { id: 'silent_k_w', icon: '🤫', name: 'Âm Câm (K & W)', words: [
        { type: 'vocab', word: "KNEE", vi: "Đầu gối", context_en: "Silent K", context_vi: "Âm 'K' không được phát âm." },
        { type: 'vocab', word: "KNIFE", vi: "Con dao", context_en: "Silent K", context_vi: "Âm 'K' không được phát âm." },
        { type: 'vocab', word: "WRIST", vi: "Cổ tay", context_en: "Silent W", context_vi: "Âm 'W' không được phát âm." },
        { type: 'vocab', word: "WRIGGLE", vi: "Vặn vẹo", context_en: "Silent W", context_vi: "Âm 'W' không được phát âm." }
      ]},
      { id: 'silent_l_b', icon: '🤐', name: 'Âm Câm (L & B)', words: [
        { type: 'vocab', word: "PALM", vi: "Lòng bàn tay", context_en: "Silent L", context_vi: "Âm 'L' không được phát âm." },
        { type: 'vocab', word: "HALF", vi: "Một nửa", context_en: "Silent L", context_vi: "Âm 'L' không được phát âm." },
        { type: 'vocab', word: "THUMB", vi: "Ngón cái", context_en: "Silent B", context_vi: "Âm 'B' không được phát âm." },
        { type: 'vocab', word: "NUMB", vi: "Tê cứng", context_en: "Silent B", context_vi: "Âm 'B' không được phát âm." }
      ]}
    ]
  },
  level3: {
    name: "Đọc Hiểu & Tư Duy", color: "orange",
    topics: [
      { id: 'true_false', icon: '✅', name: 'Đúng hay Sai?', words: [
        { type: 'quiz', word: "FALSE", question: "There is a sign about a feast.", hint: "Đọc to TRUE hoặc FALSE", vi_guide: "Có biển báo về bữa tiệc. Câu này Đúng hay Sai?" },
        { type: 'quiz', word: "TRUE", question: "The gold knight grins.", hint: "Đọc to TRUE hoặc FALSE", vi_guide: "Hiệp sĩ vàng cười rạng rỡ. Đúng hay Sai?" },
        { type: 'quiz', word: "TRUE", question: "The gold knight is hurt.", hint: "Đọc to TRUE hoặc FALSE", vi_guide: "Hiệp sĩ vàng bị thương. Đúng hay Sai?" },
        { type: 'quiz', word: "FALSE", question: "The knights rub noses.", hint: "Đọc to TRUE hoặc FALSE", vi_guide: "Hai hiệp sĩ cọ mũi vào nhau. Đúng hay Sai?" }
      ]},
      { id: 'fill_blank', icon: '🔤', name: 'Điền Từ Còn Thiếu', words: [
        { type: 'quiz', word: "SIGHS", question: "The silver knight ____ .<br><span class='text-2xl text-slate-400'>(signs / sighs)</span>", hint: "Đọc to từ điền vào chỗ trống", vi_guide: "Hiệp sĩ bạc... signs hay sighs?" },
        { type: 'quiz', word: "KNIGHT", question: "The gold ____ soars.<br><span class='text-2xl text-slate-400'>(knife / knight)</span>", hint: "Đọc to từ điền vào chỗ trống", vi_guide: "Từ còn thiếu là... knife hay knight?" },
        { type: 'quiz', word: "SORE", question: "My wrists are ____ .<br><span class='text-2xl text-slate-400'>(sore / sure)</span>", hint: "Đọc to từ điền vào chỗ trống", vi_guide: "Từ còn thiếu là... sore hay sure?" },
        { type: 'quiz', word: "SILVER", question: "The ____ knight deserves the cup.<br><span class='text-2xl text-slate-400'>(shiver / silver)</span>", hint: "Đọc to từ điền vào chỗ trống", vi_guide: "Từ còn thiếu là... shiver hay silver?" }
      ]}
    ]
  }
};

export default function App() {
  const [isSetup, setIsSetup] = useState(false);
  const [view, setView] = useState('start'); // start | categories | topics | learning
  const [totalStars, setTotalStars] = useState(0);
  
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [avatar, setAvatar] = useState({ emoji: '🐶', message: 'Chào mừng em đến với Khóa học Knight Fight!', animKey: 0 });
  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState('');
  
  // Learning States
  const [speechResult, setSpeechResult] = useState(null); // { html: ReactNode }
  const [showTarget, setShowTarget] = useState(true);
  const [showNext, setShowNext] = useState(false);

  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  // --- INIT ---
  useEffect(() => {
    injectSetup();
    const timer = setTimeout(() => setIsSetup(true), 200);
    
    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        updateAvatar("🐶👂", "Cô đang nghe đây...");
        setMicStatus("Cô đang nghe đây...");
        setSpeechResult(null);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toUpperCase();
        handleSpeechResult(transcript);
      };
      
      recognition.onspeechend = () => {
        setIsListening(false);
        setMicStatus("");
        recognition.stop();
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        setMicStatus("");
        if (event.error === 'no-speech') {
          updateAvatar("🐶❓", "Cô chưa nghe thấy gì. Em bấm lại Micro và nói to lên nhé!");
          speakAudio("Cô chưa nghe thấy gì. Em bấm lại Micro và nói to lên nhé!", 'vi-VN');
        } else {
          updateAvatar("🐶🤔", "Cô không nghe rõ, em thử lại nhé.");
        }
      };
      recognitionRef.current = recognition;
    }
    
    return () => {
      clearTimeout(timer);
      stopAllAudio();
    };
  }, []);

  // --- AUDIO ENGINE ---
  const stopAllAudio = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  const speakAudio = useCallback((text, lang = 'vi-VN', onEndCallback = null) => {
    stopAllAudio();
    const urlLang = lang === 'vi-VN' ? 'vi' : 'en';
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${urlLang}&client=tw-ob`;
    
    const audio = new Audio(url);
    audioRef.current = audio;
    
    if (onEndCallback) audio.onended = onEndCallback;
    
    audio.play().catch(e => {
      if (e.name === 'AbortError') return;
      // Fallback to SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      if (onEndCallback) utterance.onend = onEndCallback;
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const updateAvatar = (emoji, message) => {
    setAvatar(prev => ({ emoji, message, animKey: prev.animKey + 1 }));
  };

  // --- CONFETTI ENGINE ---
  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#fbbf24', '#f43f5e', '#a855f7', '#3b82f6', '#10b981'];
    
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2, y: canvas.height / 2,
        r: Math.random() * 8 + 4,
        dx: Math.random() * 14 - 7, dy: Math.random() * -14 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10, tiltAngle: 0, tiltAngleInc: (Math.random() * 0.07) + 0.05
      });
    }

    const render = () => {
      if(particles.length === 0) return;
      requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2; 
        p.x += Math.sin(p.tiltAngle) * 2;
        p.dy += 0.15; p.y += p.dy; p.x += p.dx;
        
        ctx.beginPath(); ctx.lineWidth = p.r; ctx.strokeStyle = p.color; ctx.lineCap = 'round';
        ctx.moveTo(p.x + p.tilt + p.r, p.y); 
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r); 
        ctx.stroke();
        
        if (p.y > canvas.height) particles.splice(index, 1);
      });
    };
    render();
  }, []);

  // --- LOGIC: LEARNING ---
  const handleSpeechResult = (spokenWord) => {
    const activeWords = courseData[currentCategory]?.topics.find(t => t.id === currentTopic)?.words || [];
    const targetWord = activeWords[currentIndex]?.word;
    if (!targetWord) return;

    const cleanSpoken = spokenWord.replace(/[.,!?]/g, '').trim();
    setShowTarget(false);
    
    if (cleanSpoken === targetWord) {
      setSpeechResult(<span className="text-emerald-500 drop-shadow-sm">{targetWord}</span>);
      setTotalStars(prev => prev + 1);
      updateAvatar("🐶🌟", "Xuất sắc! Cô tặng em 1 sao nhé!");
      speakAudio("Xuất sắc! Cô tặng em 1 sao nhé.", 'vi-VN');
      fireConfetti();
      setShowNext(true);
    } else {
      let matchCount = 0;
      for(let i=0; i < Math.min(targetWord.length, cleanSpoken.length); i++) {
        if(targetWord[i] === cleanSpoken[i]) matchCount++; else break;
      }
      
      let html;
      if (matchCount > 0) {
        html = (
          <>
            <span className="text-emerald-500 drop-shadow-sm">{targetWord.substring(0, matchCount)}</span>
            <span className="text-rose-500 drop-shadow-sm">{targetWord.substring(matchCount)}</span>
          </>
        );
      } else {
        html = <span className="text-rose-500 drop-shadow-sm">{targetWord}</span>;
      }
      
      setSpeechResult(html);
      const msg = `Gần đúng rồi! Em nghe cô đọc mẫu lại nhé: <span class="text-blue-600">${targetWord}</span>`;
      updateAvatar("🐶💡", msg);
      
      // Shake effect
      const targetEl = document.getElementById('result-word-container');
      if (targetEl) {
        targetEl.classList.add('animate-shake');
        setTimeout(() => targetEl.classList.remove('animate-shake'), 500);
      }

      speakAudio(`Gần đúng rồi! Em nghe cô đọc lại nhé:`, 'vi-VN', () => {
        timeoutRef.current = setTimeout(() => speakAudio(targetWord, 'en-US'), 500);
      });
    }
  };

  const loadWord = (index, cat = currentCategory, top = currentTopic) => {
    const activeWords = courseData[cat]?.topics.find(t => t.id === top)?.words || [];
    const item = activeWords[index];
    if (!item) return;

    setShowTarget(true);
    setSpeechResult(null);
    setShowNext(false);

    if (item.type === 'quiz') {
      updateAvatar("🐶❓", item.vi_guide);
      speakAudio(item.vi_guide, 'vi-VN');
    } else {
      const introMsg = `Từ này có nghĩa là: <span class="text-blue-600 font-bold">"${item.vi}"</span>.<br>Em hãy đọc to chữ màu đen nhé!`;
      updateAvatar("🐶👋", introMsg);
      speakAudio(`Nghĩa là: ${item.vi}. Em hãy đọc to từ màu đen nhé!`, 'vi-VN', () => {
        timeoutRef.current = setTimeout(() => speakAudio(item.word, 'en-US'), 500);
      });
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) { console.log(e); }
      } else {
        alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói (Vui lòng dùng Chrome/Edge).");
      }
    }
  };

  const handleNextWord = () => {
    stopAllAudio();
    const activeWords = courseData[currentCategory]?.topics.find(t => t.id === currentTopic)?.words || [];
    const nextIdx = currentIndex + 1;
    
    if (nextIdx >= activeWords.length) {
      updateAvatar("🐶🏆", "Chúc mừng! Em đã hoàn thành xuất sắc bài học này.");
      speakAudio("Chúc mừng! Em đã hoàn thành xuất sắc bài học này. Cùng học tiếp nhé!", 'vi-VN', () => {
        timeoutRef.current = setTimeout(() => handleViewTopics(currentCategory), 3500);
      });
    } else {
      setCurrentIndex(nextIdx);
      loadWord(nextIdx);
    }
  };

  // --- NAVIGATION CONTROLLERS ---
  const handleStart = () => {
    stopAllAudio();
    // Unlock audio context on iOS/Safari
    const dummy = new Audio(); dummy.play().catch(()=>{});
    
    setView('categories');
    updateAvatar("🐶🗺️", "Em muốn bắt đầu từ Cấp độ nào trong Lộ trình?");
    speakAudio("Em muốn bắt đầu từ Cấp độ nào trong Lộ trình?", 'vi-VN');
  };

  const handleViewTopics = (catId) => {
    stopAllAudio();
    const cat = courseData[catId];
    setCurrentCategory(catId);
    setView('topics');
    updateAvatar("🐶📘", `Mở sách ra nào! Em chọn bài học nào trong phần <span class="text-${cat.color}-600">${cat.name}</span>?`);
    speakAudio(`Em chọn bài học nào trong phần ${cat.name}?`, 'vi-VN');
  };

  const handleStartLesson = (topicId) => {
    stopAllAudio();
    setCurrentTopic(topicId);
    setCurrentIndex(0);
    setView('learning');
    
    const cat = courseData[currentCategory];
    const top = cat.topics.find(t => t.id === topicId);
    
    updateAvatar("🐶✨", `Bài học <span class="text-rose-500">${top.name}</span>. Bắt đầu nhé!`);
    speakAudio(`Bắt đầu bài học ${top.name} nhé!`, 'vi-VN', () => {
      timeoutRef.current = setTimeout(() => loadWord(0, currentCategory, topicId), 600);
    });
  };

  const handleBack = () => {
    stopAllAudio();
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    
    if (view === 'learning') {
      handleViewTopics(currentCategory);
    } else if (view === 'topics') {
      setView('categories');
      setCurrentCategory(null);
      updateAvatar("🐶🗺️", "Em muốn bắt đầu từ Cấp độ nào trong Lộ trình?");
      speakAudio("Em muốn bắt đầu từ Cấp độ nào trong Lộ trình?", 'vi-VN');
    }
  };

  // --- RENDERERS ---
  const renderAvatar = () => (
    <div className="mb-6 flex flex-col items-center shrink-0">
      <div 
        className="modern-bubble px-6 py-4 mb-4 text-center text-slate-700 font-semibold text-lg max-w-[95%] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: avatar.message }}
      />
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-300 rounded-full blur-2xl opacity-20"></div>
        <div 
          key={avatar.animKey} 
          className="w-24 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full flex items-center justify-center text-6xl shadow-inner border-4 border-white relative z-10 bounce-anim select-none"
        >
          {avatar.emoji}
        </div>
      </div>
    </div>
  );

  const renderStart = () => (
    <div className="w-full flex flex-col items-center justify-center flex-grow">
      <button 
        onClick={handleStart}
        className="w-full bg-blue-500 text-white text-2xl font-extrabold py-5 rounded-2xl border-b-[6px] border-blue-600 shadow-lg btn-3d outline-none"
      >
        Vào lớp học 🚀
      </button>
    </div>
  );

  const renderCategories = () => (
    <div className="w-full flex-col relative pb-4 flex">
      <div className="roadmap-line"></div>
      <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-2">Lộ trình học tập</div>
      
      {Object.entries(courseData).map(([key, cat], index) => (
        <button 
          key={key}
          onClick={() => handleViewTopics(key)} 
          className={`group relative w-full bg-white border-2 border-slate-200 rounded-[1.25rem] p-4 flex items-center gap-4 hover:border-${cat.color}-400 transition-all text-left mb-5 z-10 btn-3d outline-none shadow-sm`}
        >
          <div className={`w-12 h-12 bg-${cat.color}-500 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md z-10 shrink-0`}>
            {index + 1}
          </div>
          <div>
            <div className={`text-xs font-bold text-${cat.color}-500 uppercase tracking-wide mb-1`}>
              {index === 0 ? 'Cơ bản' : index === 1 ? 'Trung cấp' : 'Nâng cao'}
            </div>
            <div className="font-extrabold text-slate-800 text-lg leading-tight">{cat.name}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">
              {index === 0 ? 'Đọc chuẩn từ và hiểu ví dụ' : index === 1 ? 'Luyện cặp từ và âm câm (Silent letters)' : 'Giải đố theo cốt truyện Knight Fight'}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderTopics = () => {
    if (!currentCategory) return null;
    const cat = courseData[currentCategory];
    return (
      <div className="w-full flex-col pb-4 flex">
        {cat.topics.map(topic => (
          <button 
            key={topic.id}
            onClick={() => handleStartLesson(topic.id)}
            className={`group relative w-full bg-white border-2 border-slate-200 rounded-[1.25rem] p-4 flex items-center gap-5 hover:border-${cat.color}-400 transition-all text-left mb-3 btn-3d outline-none shadow-sm`}
          >
            <div className="w-14 h-14 bg-slate-100 group-hover:bg-white rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-sm border border-slate-200">
              {topic.icon}
            </div>
            <div className="font-extrabold text-slate-800 text-xl">{topic.name}</div>
          </button>
        ))}
      </div>
    );
  };

  const renderLearning = () => {
    if (!currentCategory || !currentTopic) return null;
    const activeWords = courseData[currentCategory].topics.find(t => t.id === currentTopic).words;
    const item = activeWords[currentIndex];
    if (!item) return null;

    let tagText = "Cấp độ 1: Từ vựng";
    if(currentCategory === 'level2') tagText = "Cấp độ 2: Ngữ âm";
    if(currentCategory === 'level3') tagText = "Cấp độ 3: Tư duy";

    return (
      <div className="w-full flex-col items-center flex-1 justify-between pb-4 flex">
        <div className="w-full">
          <div className="flex justify-center mb-3">
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 font-bold rounded-full text-xs tracking-wider uppercase border border-slate-200">
              {tagText}
            </span>
          </div>

          <div id="result-word-container" className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm text-center min-h-[160px] flex flex-col justify-center relative overflow-hidden">
            
            {showTarget && (
              <div 
                className={`text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight z-10`}
                dangerouslySetInnerHTML={{ __html: item.type === 'quiz' ? item.question : item.word }}
              />
            )}
            
            {showTarget && (item.context_en || item.type === 'quiz') && (
              <div className="mt-4 z-10">
                <div 
                  className={`text-lg font-medium italic ${item.type === 'quiz' ? 'text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-base border border-amber-200 inline-block' : 'text-slate-600'}`}
                  dangerouslySetInnerHTML={{ __html: item.type === 'quiz' ? item.hint : `Ví dụ: "${item.context_en}"` }}
                />
                {item.type !== 'quiz' && <div className="text-sm text-blue-500 font-semibold mt-1">({item.context_vi})</div>}
              </div>
            )}

            {!showTarget && (
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2 z-10 h-12 flex items-center justify-center">
                {speechResult}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-6 flex-grow">
          <button 
            onClick={handleMicClick}
            className={`w-20 h-20 bg-gradient-to-b from-rose-400 to-rose-500 rounded-full flex items-center justify-center text-4xl text-white shadow-xl shadow-rose-500/40 border-4 border-white z-10 transition-transform active:scale-95 outline-none ${isListening ? 'mic-ripple' : ''}`}
          >
            <Mic size={32} fill="white" />
          </button>
          <div className="text-slate-400 font-semibold mt-4 h-6 text-sm text-center animate-pulse">
            {micStatus}
          </div>
        </div>
        
        {showNext && (
          <button 
            onClick={handleNextWord}
            className="w-full bg-emerald-500 text-white text-xl font-extrabold py-4 rounded-2xl border-b-[6px] border-emerald-600 shadow-lg btn-3d outline-none mt-2"
          >
            Tiếp tục ➔
          </button>
        )}
      </div>
    );
  };

  if (!isSetup) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]" />

      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(15,_23,_42,_0.1)] w-full max-w-md overflow-hidden flex flex-col relative z-10 h-[780px] max-h-[95vh] border-4 border-white">
        
        {/* HEADER */}
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 z-20 shrink-0">
          {view !== 'start' ? (
            <button 
              onClick={handleBack} 
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors outline-none"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <div className="w-10" />
          )}
          
          <div className="flex-grow text-center font-bold text-slate-800 text-lg tracking-wide flex items-center justify-center gap-2">
            <span className="text-blue-500 text-2xl">🎓</span> English Buddy
          </div>
          
          <div className="w-10 flex justify-end">
            <div className="bg-amber-100 text-amber-600 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
              <span>{totalStars}</span><Star size={14} className="fill-amber-500 text-amber-500"/>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-grow p-6 flex flex-col overflow-y-auto overflow-x-hidden relative">
          {renderAvatar()}
          {view === 'start' && renderStart()}
          {view === 'categories' && renderCategories()}
          {view === 'topics' && renderTopics()}
          {view === 'learning' && renderLearning()}
        </div>
      </div>
    </div>
  );
}