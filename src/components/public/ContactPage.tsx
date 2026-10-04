import React from 'react';
import { ContactFAQView } from './ContactFAQView';

export const ContactPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return <ContactFAQView onBack={onBack} />;
};

export default ContactPage;
