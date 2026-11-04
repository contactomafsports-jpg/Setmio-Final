import React from 'react';
import { useApp } from '../../context/AppContext';
import { NewBookingModal } from './NewBookingModal';

export interface NewBookingPageProps {
  onBack?: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultCourtId?: string;
  defaultVenueId?: string;
}

export const NewBookingPage: React.FC<NewBookingPageProps> = ({
  onBack,
  defaultDate,
  defaultTime,
  defaultCourtId,
  defaultVenueId,
}) => {
  const { setAdminTab, newBookingDraft, setNewBookingDraft } = useApp();

  const handleBack = () => {
    if (setNewBookingDraft) {
      setNewBookingDraft(null);
    }
    if (onBack) {
      onBack();
    } else {
      setAdminTab('agenda');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/gestion/reservas');
      }
    }
  };

  const initialDateProp = defaultDate || newBookingDraft?.date;
  const initialTimeProp = defaultTime || newBookingDraft?.time;
  const initialCourtProp = defaultCourtId || newBookingDraft?.courtId;
  const initialVenueProp = defaultVenueId || newBookingDraft?.venueId;

  return (
    <NewBookingModal
      isOpen={true}
      onClose={handleBack}
      defaultDate={initialDateProp}
      defaultTime={initialTimeProp}
      defaultCourtId={initialCourtProp}
      defaultVenueId={initialVenueProp}
    />
  );
};

export default NewBookingPage;
