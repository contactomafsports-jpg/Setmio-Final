import React from 'react';
import { ContactFAQView } from './ContactFAQView';

export const ContactView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return <ContactFAQView onBack={onBack} />;
};

export default ContactView;
