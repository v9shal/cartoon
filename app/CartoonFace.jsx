'use client';

import React, { useState, useEffect } from 'react';

const CartoonFace = () => {
  const [headRotation, setHeadRotation] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          setHeadRotation(prevRotation => {
            const newRotation = prevRotation === -90 ? 0 : +90;
            return newRotation;
          });
          break;
        case 'ArrowRight':
          setHeadRotation(prevRotation => {
            const newRotation = prevRotation === 90 ? 0 : -90;
            return newRotation;
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (a
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="relative w-64 h-64">
        <div 
          style={{
            transform: `rotate(${headRotation}deg)`,
            transition: 'transform 0.3s ease'
          }}
          className="absolute w-64 h-64 bg-yellow-300 rounded-full border-4 border-black"
        >
          <div className="absolute top-24 left-16 w-12 h-12 bg-white rounded-full border-2 border-black">
            <div className="absolute top-3 left-3 w-6 h-6 bg-black rounded-full" />
          </div>
          <div className="absolute top-24 right-16 w-12 h-12 bg-white rounded-full border-2 border-black">
            <div className="absolute top-3 left-3 w-6 h-6 bg-black rounded-full" />
          </div>
          
          
        </div>
      </div>
    
    </div>
  );
};

export default CartoonFace;