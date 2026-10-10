import React from 'react';
import { useApp } from '../../context/AppContext';
import { HomeView } from './HomeView';
import { CoachPublicView } from './CoachPublicView';
import { AcademyPublicLanding } from './AcademyPublicLanding';
import { ProPlayerPublicView } from './ProPlayerPublicView';
import { ShopView } from './ShopView';
import { TournamentsView } from './TournamentsView';

/**
 * Plantilla Pública Adaptativa (/p/[slug] o Web Pública de Tenant)
 * Adapta dinámicamente los bloques y contenido según la entidad activa:
 * - COACH: Perfil profesional personal con clases, bonos, metodología, sin alquiler de pistas.
 * - ACADEMY: Escuela formativa con programas, grupos, entrenadores y pruebas de nivel, sin alquiler libre.
 * - PRO_PLAYER: Portfolio público con palmarés, circuito FIP, calendario y patrocinadores.
 * - PADEL_CLUB: Web del club con reserva de pistas en tiempo real, partidos, escuela y torneos.
 */
export const PublicEntityLanding: React.FC = () => {
  const { currentTenant } = useApp();

  switch (currentTenant.type) {
    case 'COACH':
      return <CoachPublicView />;
    case 'ACADEMY':
      return <AcademyPublicLanding />;
    case 'PRO_PLAYER':
      return <ProPlayerPublicView />;
    case 'ONLINE_STORE':
      return <ShopView />;
    case 'TOURNAMENT_ORGANIZER':
      return <TournamentsView />;
    case 'PADEL_CLUB':
    default:
      return <HomeView />;
  }
};
