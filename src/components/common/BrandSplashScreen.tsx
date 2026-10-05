import React, { useEffect } from 'react';

interface BrandSplashScreenProps {
  onComplete: () => void;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return null;
};

