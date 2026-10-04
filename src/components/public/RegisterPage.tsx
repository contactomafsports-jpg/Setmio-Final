import React from 'react';
import { AuthModal } from './AuthModal';
import { useApp } from '../../context/AppContext';

export const RegisterPage: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { setPublicPage } = useApp();

  const handleClose = () => {
    if (onClose) onClose();
    else {
      setPublicPage('home');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  return <AuthModal isOpen={true} onClose={handleClose} initialMode="register" />;
};

export default RegisterPage;
