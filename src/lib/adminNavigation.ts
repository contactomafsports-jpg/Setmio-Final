import {
  Layers,
  Calendar,
  CreditCard,
  Users,
  Trophy,
  GraduationCap,
  Receipt,
  ShoppingBag,
  Palette,
  Globe,
  Briefcase,
  Settings,
  LayoutDashboard,
  Building2,
  UserCheck,
  LucideIcon,
} from 'lucide-react';
import { AdminTab, ClubVenue, UserSession } from '../context/AppContext';
import { Tenant } from '../types/database';

export interface AdminNavItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
  desc?: string;
  badge?: string;
  colorClass?: string;
  isPrimary: boolean;
}

export interface AdminNavConfig {
  roleTitle: string;
  roleSubtitle: string;
  isReception: boolean;
  isCoach: boolean;
  isAcademy: boolean;
  isProAthlete: boolean;
  isOrganizer: boolean;
  isClub: boolean;
  hasPhysicalInfrastructure: boolean;
  hasMultipleVenues: boolean;
  primaryItems: AdminNavItem[];
  secondaryItems: AdminNavItem[];
  allItems: AdminNavItem[];
}

export function getAdminNavConfig(
  currentTenant: Tenant,
  currentUser: UserSession,
  isMultiVenue?: boolean,
  venues?: ClubVenue[]
): AdminNavConfig {
  const isCoach =
    currentTenant.type === 'COACH' || currentUser.role === 'COACH';
  const isAcademy =
    currentTenant.type === 'ACADEMY' || currentUser.role === 'ACADEMY_MANAGER';
  const isProAthlete =
    currentTenant.type === 'PRO_PLAYER' || currentUser.role === 'PROFESSIONAL_PLAYER';
  const isOrganizer =
    currentTenant.type === 'TOURNAMENT_ORGANIZER' || currentUser.role === 'TOURNAMENT_ORGANIZER';
  const isReception = currentUser.role === 'RECEPTION';
  const isClub = !isCoach && !isAcademy && !isProAthlete && !isOrganizer;

  // Lógica de infraestructura física:
  // Solo los clubes gestionan infraestructura física propia (pistas, domótica, control de accesos).
  // Profesores independientes, jugadores pro y organizadores NO gestionan instalaciones físicas.
  const hasPhysicalInfrastructure = isClub && !isCoach && !isProAthlete && !isOrganizer;

  // Lógica condicional de Sedes:
  // El selector y opciones de "Varias Sedes" SOLO aparecen si:
  // 1. Es un club con infraestructura física (isClub)
  // 2. NO es perfil profesional (profesor, atleta, organizador)
  // 3. NO es modo mostrador de recepción de sede fija
  // 4. Tiene habilitado multi-sede (isMultiVenue)
  // 5. Gestiona activamente más de una localización física (venues.length > 1)
  const hasMultipleVenues =
    isClub &&
    !isReception &&
    Boolean(isMultiVenue) &&
    Array.isArray(venues) &&
    venues.length > 1;

  let primaryItems: AdminNavItem[] = [];
  let secondaryItems: AdminNavItem[] = [];
  let roleTitle = 'Setmio Pro';
  let roleSubtitle = 'Admin Club (SaaS)';

  if (isReception) {
    // -------------------------------------------------------------
    // RECEPCIÓN / MARCA BLANCA DEL CLUB (MOSTRADOR FÍSICO)
    // Menú unificado único, adaptado, limpio y sin duplicaciones
    // -------------------------------------------------------------
    roleTitle = currentTenant.name;
    roleSubtitle = 'Recepción · Marca Blanca';

    primaryItems = [
      {
        id: 'dashboard',
        label: 'Inicio',
        icon: LayoutDashboard,
        desc: 'Cuadro de mandos y resumen del club',
        isPrimary: true,
      },
      {
        id: 'agenda',
        label: 'Reservas',
        icon: Calendar,
        desc: 'Reservas del día y turnos de juego',
        isPrimary: true,
      },
      {
        id: 'matches',
        label: 'Partidas',
        icon: Trophy,
        desc: 'Partidos abiertos de jugadores y plazas libres',
        isPrimary: true,
      },
      {
        id: 'pos_cafe',
        label: 'TPV / Caja',
        icon: CreditCard,
        desc: 'Cobros de reservas, suplementos y cafetería',
        isPrimary: true,
      },
    ];

    secondaryItems = [
      {
        id: 'courts_management',
        label: 'Pistas & Domótica',
        icon: Layers,
        desc: 'Estado de pistas y luces en tiempo real',
        isPrimary: false,
      },
      {
        id: 'customers',
        label: 'Miembros & Clientes',
        icon: Users,
        desc: 'Búsqueda rápida de socios y cobros de monedero',
        isPrimary: false,
      },
      {
        id: 'tournaments',
        label: 'Torneos del Club',
        icon: Trophy,
        desc: 'Consulta de cuadros y estado de inscripciones',
        isPrimary: false,
      },
      {
        id: 'shop',
        label: 'Tienda Mostrador',
        icon: ShoppingBag,
        desc: 'Venta de pelotas, grips y bebidas en recepción',
        isPrimary: false,
      },
    ];
  } else if (isOrganizer) {
    // -------------------------------------------------------------
    // ORGANIZADOR DE EVENTOS (COMPETICIONES Y LIGAS)
    // -------------------------------------------------------------
    roleTitle = 'Setmio Pro Events';
    roleSubtitle = 'Admin Organizador (SaaS)';

    primaryItems = [
      {
        id: 'tournaments',
        label: 'Competiciones',
        icon: Trophy,
        desc: 'Gestión de torneos, categorías y cuadros oficiales',
        isPrimary: true,
      },
      {
        id: 'matches',
        label: 'Ligas & Cuadros',
        icon: Layers,
        desc: 'Cuadros de eliminatorias, consolación y cruces',
        isPrimary: true,
      },
      {
        id: 'customers',
        label: 'Patrocinadores & Marcas',
        icon: Briefcase,
        desc: 'Sponsors comerciales y empresas colaboradoras',
        isPrimary: true,
      },
      {
        id: 'courts_management',
        label: 'Sedes del Evento',
        icon: Building2,
        desc: 'Clubes sede asociados al circuito oficial',
        isPrimary: true,
      },
    ];

    secondaryItems = [
      {
        id: 'dashboard',
        label: 'Resumen del Circuito',
        icon: LayoutDashboard,
        desc: 'Métricas de parejas, cuadros y calendario oficial',
        isPrimary: false,
      },
      {
        id: 'agenda',
        label: 'Calendario Oficial',
        icon: Calendar,
        desc: 'Fechas de pruebas y asignación de cuadrantes',
        isPrimary: false,
      },
      {
        id: 'invoicing',
        label: 'Recaudación & Premios',
        icon: Receipt,
        desc: 'Bolsa de premios y liquidación de inscripciones',
        badge: 'Premios',
        isPrimary: false,
      },
      {
        id: 'web_editor',
        label: 'Web Oficial Circuito',
        icon: Palette,
        desc: 'Personalización de la web homologada del torneo',
        badge: 'Marca Blanca',
        isPrimary: false,
      },
      {
        id: 'domains',
        label: 'Dominio Oficial & SSL',
        icon: Globe,
        desc: 'Dominio propio del circuito con SSL activo',
        isPrimary: false,
      },
      {
        id: 'settings',
        label: 'Ajustes de Torneo',
        icon: Settings,
        desc: 'Reglamentos oficiales, cuotas y jueces árbitros',
        isPrimary: false,
      },
    ];
  } else if (isCoach) {
    // -------------------------------------------------------------
    // PROFESOR INDEPENDIENTE (SIN PISTAS CLUB NI TPV CLUB)
    // -------------------------------------------------------------
    roleTitle = 'Setmio Coach';
    roleSubtitle = 'Admin Profesor (SaaS)';

    primaryItems = [
      {
        id: 'academy',
        label: 'Mis Clases',
        icon: GraduationCap,
        desc: 'Clases particulares, grupos y contenidos tácticos',
        isPrimary: true,
      },
      {
        id: 'customers',
        label: 'Alumnos',
        icon: Users,
        desc: 'Directorio de alumnos particulares y seguimiento',
        isPrimary: true,
      },
      {
        id: 'agenda',
        label: 'Calendario Personal',
        icon: Calendar,
        desc: 'Agenda privada de clases y pistas asignadas',
        isPrimary: true,
      },
      {
        id: 'settings',
        label: 'Tarifas & Bonos',
        icon: CreditCard,
        desc: 'Configuración de precios por hora y bonos',
        isPrimary: true,
      },
    ];

    secondaryItems = [
      {
        id: 'dashboard',
        label: 'Valoraciones & Reseñas',
        icon: Trophy,
        desc: 'Métricas de valoración 4.96 ★ y feedback de alumnos',
        badge: '4.96 ★',
        isPrimary: false,
      },
      {
        id: 'invoicing',
        label: 'Cobros Directos',
        icon: Receipt,
        desc: 'Honorarios particulares y cobros directos de alumnos',
        badge: 'Directo',
        isPrimary: false,
      },
      {
        id: 'web_editor',
        label: 'Web Personal Marca Blanca',
        icon: Palette,
        desc: 'Personalización de web propia del entrenador',
        badge: 'Marca Blanca',
        isPrimary: false,
      },
      {
        id: 'domains',
        label: 'Dominio Personal & SSL',
        icon: Globe,
        desc: 'Dominio personalizado con DNS y SSL activo',
        isPrimary: false,
      },
      {
        id: 'subscription',
        label: 'Plan Profesor Pro',
        icon: Briefcase,
        desc: 'Suscripción Setmio Coach activa',
        badge: 'COACH',
        isPrimary: false,
      },
    ];
  } else if (isAcademy) {
    // -------------------------------------------------------------
    // ACADEMIA / ESCUELA DE PÁDEL
    // -------------------------------------------------------------
    roleTitle = 'Setmio Pro Academia';
    roleSubtitle = 'Admin Escuela (SaaS)';

    primaryItems = [
      {
        id: 'academy',
        label: 'Cursos & Grupos',
        icon: GraduationCap,
        desc: 'Cursos trimestrales, niveles y asignación de pistas',
        isPrimary: true,
      },
      {
        id: 'agenda',
        label: 'Asistencia & Horarios',
        icon: Calendar,
        desc: 'Control de asistencia diario y horarios de grupos',
        isPrimary: true,
      },
      {
        id: 'customers',
        label: 'Alumnos',
        icon: Users,
        desc: 'Expediente de alumnos, edades y tutores legales',
        isPrimary: true,
      },
      {
        id: 'invoicing',
        label: 'Pagos & Cuotas',
        icon: Receipt,
        desc: 'Cuotas periódicas, remesas y cobros de matrícula',
        isPrimary: true,
      },
    ];

    secondaryItems = [
      {
        id: 'dashboard',
        label: 'Resumen Escuela',
        icon: LayoutDashboard,
        desc: 'Ocupación de grupos, matrículas y alumnos activos',
        isPrimary: false,
      },
      {
        id: 'web_editor',
        label: 'Web Oficial Escuela',
        icon: Palette,
        desc: 'Personalización de la web de la academia',
        badge: 'Marca Blanca',
        isPrimary: false,
      },
      {
        id: 'domains',
        label: 'Dominio Oficial',
        icon: Globe,
        desc: 'Dominio propio con SSL activo',
        isPrimary: false,
      },
      {
        id: 'subscription',
        label: 'Plan Escuela Pro',
        icon: Briefcase,
        desc: 'Suscripción Setmio Pro Escuela activa',
        badge: 'PRO',
        isPrimary: false,
      },
      {
        id: 'settings',
        label: 'Ajustes de Escuela',
        icon: Settings,
        desc: 'Reglamentos, cuotas y notificaciones de escuela',
        isPrimary: false,
      },
    ];
  } else if (isProAthlete) {
    // -------------------------------------------------------------
    // JUGADOR PROFESIONAL (FIP / PREMIER PADEL)
    // -------------------------------------------------------------
    roleTitle = 'Setmio Pro Athlete';
    roleSubtitle = 'Admin Atleta Pro';

    primaryItems = [
      {
        id: 'agenda',
        label: 'Calendario de Torneos',
        icon: Calendar,
        desc: 'Pruebas del circuito FIP y Premier Pádel',
        isPrimary: true,
      },
      {
        id: 'customers',
        label: 'Patrocinadores & Marcas',
        icon: Briefcase,
        desc: 'Contratos comerciales, sponsors y activaciones',
        isPrimary: true,
      },
      {
        id: 'dashboard',
        label: 'Rendimiento Pro',
        icon: LayoutDashboard,
        desc: 'Métricas deportivas oficiales, victorias y ranking',
        isPrimary: true,
      },
      {
        id: 'matches',
        label: 'Estadísticas & FIP',
        icon: Trophy,
        desc: 'Historial de partidos oficiales FIP y palmarés',
        isPrimary: true,
      },
    ];

    secondaryItems = [
      {
        id: 'invoicing',
        label: 'Gastos de Viaje & Facturas',
        icon: Receipt,
        desc: 'Presupuestos de desplazamientos, premios y facturas',
        badge: 'Viajes',
        isPrimary: false,
      },
      {
        id: 'academy',
        label: 'Clinics & Exhibiciones VIP',
        icon: GraduationCap,
        desc: 'Partidos de exhibición y clinics comerciales',
        isPrimary: false,
      },
      {
        id: 'web_editor',
        label: 'Web Marca Blanca',
        icon: Palette,
        desc: 'Personalización de la web oficial del atleta',
        badge: 'Marca Blanca',
        isPrimary: false,
      },
      {
        id: 'domains',
        label: 'Dominio Oficial & SSL',
        icon: Globe,
        desc: 'Dominio propio con DNS y SSL activo',
        isPrimary: false,
      },
      {
        id: 'subscription',
        label: 'Plan Elite Atleta Pro',
        icon: Briefcase,
        desc: 'Suscripción Setmio Pro Athlete activa',
        badge: 'PRO',
        isPrimary: false,
      },
      {
        id: 'settings',
        label: 'Ajustes del Atleta',
        icon: Settings,
        desc: 'Notificaciones, agenda y canales preferidos',
        isPrimary: false,
      },
    ];
  } else {
    // -------------------------------------------------------------
    // CLUB DE PÁDEL (ADMINISTRACIÓN GENERAL CON PISTAS E INSTALACIONES)
    // -------------------------------------------------------------
    roleTitle = 'Setmio Pro';
    roleSubtitle = 'Admin Club (SaaS)';

    primaryItems = [
      {
        id: 'dashboard',
        label: 'Inicio',
        icon: LayoutDashboard,
        desc: 'Cuadro de mandos y resumen del club',
        isPrimary: true,
      },
      {
        id: 'agenda',
        label: 'Reservas',
        icon: Calendar,
        desc: 'Cuadrante diario de pistas, reservas y turnos',
        isPrimary: true,
      },
      {
        id: 'matches',
        label: 'Partidas',
        icon: Trophy,
        desc: 'Partidos abiertos de jugadores y división de pagos',
        isPrimary: true,
      },
      {
        id: 'pos_cafe',
        label: 'TPV / Caja',
        icon: CreditCard,
        desc: 'Cobros en mostrador, cafetería y caja diaria',
        isPrimary: true,
      },
    ];

    secondaryItems = [
      {
        id: 'courts_management',
        label: 'Pistas & Domótica',
        icon: Layers,
        desc: 'Pistas, domótica IoT y control de accesos',
        isPrimary: false,
      },
      {
        id: 'customers',
        label: 'Miembros',
        icon: Users,
        desc: 'Directorio de socios, cartera y niveles de juego',
        isPrimary: false,
      },
      {
        id: 'tournaments',
        label: 'Torneos',
        icon: Trophy,
        desc: 'Torneos oficiales, cuadros y rankings',
        isPrimary: false,
      },
      {
        id: 'academy',
        label: 'Escuela de Pádel',
        icon: GraduationCap,
        desc: 'Grupos, alumnos y entrenadores de la escuela',
        isPrimary: false,
      },
      {
        id: 'invoicing',
        label: 'Facturación & AEAT',
        icon: Receipt,
        desc: 'Dashboard financiero, facturas y Veri*factu AEAT',
        badge: 'Veri*factu',
        isPrimary: false,
      },
      {
        id: 'shop',
        label: 'Tienda y Pedidos',
        icon: ShoppingBag,
        desc: 'Catálogo de palas, accesorios e inventario del club',
        isPrimary: false,
      },
      {
        id: 'teams',
        label: 'Equipos del Club',
        icon: Users,
        desc: 'Convocatorias de ligas federadas y capitanes',
        isPrimary: false,
      },
      {
        id: 'web_editor',
        label: 'Marca Blanca',
        icon: Palette,
        desc: 'Logo, colores oficiales y web pública del club',
        badge: 'Marca Blanca',
        isPrimary: false,
      },
      {
        id: 'domains',
        label: 'Dominios y DNS',
        icon: Globe,
        desc: 'Tu propio dominio .com con certificado SSL',
        isPrimary: false,
      },
      {
        id: 'subscription',
        label: 'Suscripción SaaS',
        icon: Briefcase,
        desc: 'Plan Enterprise Top activo de Setmio',
        badge: 'Enterprise',
        isPrimary: false,
      },
      {
        id: 'settings',
        label: 'Configuración Club',
        icon: Settings,
        desc: 'Horarios, políticas, luces domóticas y WhatsApp',
        isPrimary: false,
      },
      {
        id: 'staff',
        label: 'Personal & Profesores',
        icon: UserCheck,
        desc: 'Gestión de empleados, turnos laborales y registro de acciones',
        isPrimary: false,
      },
    ];
  }

  const allItems = [...primaryItems, ...secondaryItems];

  return {
    roleTitle,
    roleSubtitle,
    isReception,
    isCoach,
    isAcademy,
    isProAthlete,
    isOrganizer,
    isClub,
    hasPhysicalInfrastructure,
    hasMultipleVenues,
    primaryItems,
    secondaryItems,
    allItems,
  };
}
