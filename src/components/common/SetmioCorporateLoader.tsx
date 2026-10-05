import React, { useEffect } from 'react';

interface SetmioCorporateLoaderProps {
  onComplete: () => void;
}

export const SetmioCorporateLoader: React.FC<SetmioCorporateLoaderProps> = ({ onComplete }) => {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return null;
};
