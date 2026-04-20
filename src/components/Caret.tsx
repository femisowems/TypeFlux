import { useEffect, useState } from 'react';

interface CaretProps {
  typedWords: string[];
  errorTrigger: number;
}

export const Caret = ({ typedWords, errorTrigger }: CaretProps) => {
  const [position, setPosition] = useState({ left: 0, top: 0, height: 30, isVisible: false });
  const [isTyping, setIsTyping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeChar = document.getElementById('active-char');
      const container = document.getElementById('typing-area-wrapper');
      
      if (activeChar && container) {
        const charRect = activeChar.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        setPosition({ 
          left: charRect.left - containerRect.left, 
          top: charRect.top - containerRect.top,
          height: charRect.height,
          isVisible: true 
        });
      }
    }, 0);
    
    setIsTyping(true);
    const stopTyping = setTimeout(() => setIsTyping(false), 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(stopTyping);
    }
  }, [typedWords]);

  useEffect(() => {
    if (errorTrigger > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 200);
      return () => clearTimeout(timer);
    }
  }, [errorTrigger]);

  if (!position.isVisible) return null;

  return (
    <div 
      className={`caret ${isTyping ? 'smooth' : ''} ${isShaking ? 'shake' : ''}`}
      style={{ 
        left: position.left, 
        top: position.top + (position.height - 35) / 2, 
      }}
    />
  );
};
