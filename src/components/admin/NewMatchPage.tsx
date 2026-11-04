import React from 'react';
import { useApp } from '../../context/AppContext';
import { NewMatchModal } from './NewMatchModal';

export interface NewMatchPageProps {
  onBack?: () => void;
  defaultDate?: string;
  defaultCourtId?: string;
  defaultVenueId?: string;
}

export const NewMatchPage: React.FC<NewMatchPageProps> = ({
  onBack,
  defaultDate,
  defaultCourtId,
  defaultVenueId,
}) => {
  const { setAdminTab } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setAdminTab('matches');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/gestion/partidas');
      }
    }
  };

  return (
    <NewMatchModal
      isOpen={true}
      onClose={handleBack}
      defaultDate={defaultDate}
      defaultCourtId={defaultCourtId}
      defaultVenueId={defaultVenueId}
    />
  );
};

export default NewMatchPage;
