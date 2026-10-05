import React from 'react';
import { AdminAgenda } from './AdminAgenda';
import { AllBookingsPage } from './AllBookingsPage';

export interface BookingsViewProps {
  initialView?: 'quadrant' | 'all';
}

export const BookingsView: React.FC<BookingsViewProps> = ({ initialView = 'quadrant' }) => {
  return <AdminAgenda />;
};

export default BookingsView;
export { AdminAgenda, AllBookingsPage };
