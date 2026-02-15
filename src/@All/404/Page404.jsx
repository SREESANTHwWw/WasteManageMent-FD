import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Typography } from '../Tags/Tags';


const Error404 = () => {
  const leafRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Floating animation for the character
      gsap.to(leafRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // 2. Initial entrance for text
      gsap.from(textRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        ease: "back.out(1.7)"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3. Mouse follow effect for the "Lost" character
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 25;
    const y = (clientY - window.innerHeight / 2) / 25;

    gsap.to(leafRef.current, {
      x: x,
      y: y,
      duration: 1,
      ease: "power2.out"
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 overflow-hidden relative"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-20 text-6xl opacity-20">🍃</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20">🌿</div>
      <div className="absolute top-1/2 left-10 text-4xl opacity-10">🌲</div>

      {/* The Character */}
      <div ref={leafRef} className="relative mb-8 cursor-grab active:cursor-grabbing">
        <div className="text-[120px] sm:text-[180px] select-none filter drop-shadow-2xl">
          🌱
        </div>
        {/* Animated Eyes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8">
          <div className="w-4 h-4 bg-slate-800 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-slate-800 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Content */}
      <div ref={textRef} className="text-center z-10">
        <Typography className="text-9xl font-black text-emerald-600/20 leading-none mb-4">
          404
        </Typography>
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
          Oops! This path is overgrown.
        </h1>
        
        <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">
          The page you're looking for has been reclaimed by nature or never existed in this ecosystem.
        </p>

        {/* Back to Safety Button */}
        <Link to="/">
          <button className="group relative px-8 py-4 cursor-pointer bg-emerald-600 rounded-2xl text-white font-bold text-lg shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95">
            <span className="flex items-center gap-2">
              Return to Forest 🏠
            </span>
          </button>
        </Link>
      </div>

      {/* Grass Footer */}
      <div className="absolute bottom-0 w-full flex justify-center gap-1 opacity-40">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="w-4 h-12 bg-emerald-400 rounded-t-full transition-all duration-500 hover:h-20"
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Error404;