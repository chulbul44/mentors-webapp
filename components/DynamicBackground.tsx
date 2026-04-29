"use client";

import React from "react";

const DynamicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary animated blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      
      {/* Secondary animated blob */}
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob [animation-delay:2s]"></div>
      
      {/* Tertiary animated blob */}
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob [animation-delay:4s]"></div>
      
      {/* Subtle grid pattern for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default DynamicBackground;
