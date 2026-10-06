// @ts-nocheck
export const DEMO_ROLES_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    "demo.title": "Entorno Demo",
    "demo.badge": "Simulador de Roles Setmio",
    "demo.heading": "Selecciona el Rol de Demostración",
    "demo.description": "Explora las interfaces completas y datos reales según cada perfil de usuario en la plataforma.",
    "demo.tryAs": "Probar como",
    "demo.close": "Cerrar",
    "demo.note": "Los usuarios con rol profesional (Admin o Profesor) pueden conmutar a Modo Jugador en cualquier momento con el selector en cabecera.",
    "demo.roles.superadmin.badge": "Plataforma Global",
    "demo.roles.tenant_owner.badge": "Gestión Club",
    "demo.roles.coach_independent.badge": "Profesor Cliente",
    "demo.roles.coach_club.badge": "Profesor de Club",
    "demo.roles.player.badge": "Área Jugador",
    "demo.roles.player_amateur.badge": "Área Jugador",
    "demo.roles.superadmin.access": "Has ingresado al entorno con perfil y permisos de Plataforma Global.",
    "demo.roles.tenant_owner.access": "Has ingresado al entorno con perfil y permisos de Gestión Club.",
    "demo.roles.coach_independent.access": "Has ingresado al entorno con perfil y permisos de Profesor Cliente.",
    "demo.roles.coach_club.access": "Has ingresado al entorno con perfil y permisos de Profesor de Club.",
    "demo.roles.player.access": "Has ingresado al entorno con perfil y permisos de Área Jugador.",
    "demo.roles.player_amateur.access": "Has ingresado al entorno con perfil y permisos de Área Jugador."
  },

  en: {
    "demo.title": "Demo Environment",
    "demo.badge": "Setmio Role Simulator",
    "demo.heading": "Select Demo User Role",
    "demo.description": "Explore complete interfaces and real data across each user profile on the platform.",
    "demo.tryAs": "Try as",
    "demo.close": "Close",
    "demo.note": "Users with professional roles (Admin or Coach) can switch to Player Mode at any time using the header toggle.",
    "demo.roles.superadmin.badge": "Global Platform",
    "demo.roles.tenant_owner.badge": "Club Management",
    "demo.roles.coach_independent.badge": "Client Coach",
    "demo.roles.coach_club.badge": "Club Coach",
    "demo.roles.player.badge": "Player Area",
    "demo.roles.player_amateur.badge": "Player Area",
    "demo.roles.superadmin.access": "You entered the demo environment with Global Platform permissions.",
    "demo.roles.tenant_owner.access": "You entered the demo environment with Club Management permissions.",
    "demo.roles.coach_independent.access": "You entered the demo environment with Client Coach permissions.",
    "demo.roles.coach_club.access": "You entered the demo environment with Club Coach permissions.",
    "demo.roles.player.access": "You entered the demo environment with Player Area permissions.",
    "demo.roles.player_amateur.access": "You entered the demo environment with Player Area permissions."
  }
};

// Aliases for regional & other languages (Strict rule: fallback to EN, NEVER ES)
DEMO_ROLES_TRANSLATIONS.gl = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.ca = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.va = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.eu = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.pt = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.it = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.fr = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.de = { ...DEMO_ROLES_TRANSLATIONS.en };
DEMO_ROLES_TRANSLATIONS.ar = { ...DEMO_ROLES_TRANSLATIONS.en };
