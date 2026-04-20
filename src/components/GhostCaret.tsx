import { useEffect, useState } from 'react';

interface GhostCaretProps {
  ghostCharIndex: number;
}

export const GhostCaret = ({ ghostCharIndex }: GhostCaretProps) => {
  const [position, setPosition] = useState({ left: 0, top: 0, height: 30, isVisible: false });

  useEffect(() => {
    if (ghostCharIndex < 0) {
      setPosition(prev => ({ ...prev, isVisible: false }));
      return;
    }

    const timer = setTimeout(() => {
      const charElement = document.getElementById(`char-global-${ghostCharIndex}`);
      const container = document.getElementById('typing-area-wrapper');
      
      if (charElement && container) {
        const charRect = charElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        setPosition({ 
          left: charRect.left - containerRect.left, 
          top: charRect.top - containerRect.top,
          height: charRect.height,
          isVisible: true 
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [ghostCharIndex]);

  if (!position.isVisible) return null;

  return (
    <div 
      className="caret ghost-caret"
      style={{ 
        left: position.left, 
        top: position.top + (position.height - 35) / 2, 
      }}
    />
  );
};
