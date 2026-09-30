import { UserRole, TenantType, PlanTier } from '../types/database';

export type PermissionAction =
  | 'view_dashboard'
  | 'manage_courts'
  | 'manage_bookings'
  | 'view_agenda'
  | 'manage_customers'
  | 'manage_academy'
  | 'manage_tournaments'
  | 'manage_shop'
  | 'manage_smart_courts'
  | 'manage_pos_cafe'
  | 'manage_web_builder'
  | 'manage_domains'
  | 'manage_billing'
  | 'manage_settings'
  | 'manage_tenants_hq'
  | 'alter_demo_structural'
  | 'book_court'
  | 'join_match'
  | 'create_match';

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: 'role_forbidden' | 'plan_limit' | 'tenant_type_mismatch' | 'demo_locked';
  message?: string;
  requiredPlan?: PlanTier;
}

export function checkPermission(
  role: UserRole,
  action: PermissionAction,
  tenantType: TenantType,
  plan: PlanTier,
  isDemoLocked: boolean = false
): PermissionCheckResult {
  // Superadmin has absolute access across the entire platform
  if (role === 'SUPERADMIN') {
    return { allowed: true };
  }

  // Demo locked protection (Section 10: Non-superadmin cannot change structural demo configuration)
  if (action === 'alter_demo_structural' && isDemoLocked) {
    return {
      allowed: false,
      reason: 'demo_locked',
      message: 'Esta propiedad estructural de Centro de Pádel San Mateo está bloqueada en modo demostración. Solo Superadmin puede modificarla.',
    };
  }

  // Superadmin only actions
  if (action === 'manage_tenants_hq') {
    return {
      allowed: false,
      reason: 'role_forbidden',
      message: 'Acceso exclusivo reservado para el Superadministrador de Setmio HQ.',
    };
  }

  // Role permissions
  const ownerOrAdmin = role === 'TENANT_OWNER' || role === 'TENANT_ADMIN';

  switch (action) {
    case 'manage_billing':
      if (role !== 'TENANT_OWNER') {
        return {
          allowed: false,
          reason: 'role_forbidden',
          message: 'Solo el Propietario del Club puede gestionar la suscripción y facturación.',
        };
      }
      return { allowed: true };

    case 'manage_domains':
    case 'manage_web_builder':
    case 'manage_settings':
      if (!ownerOrAdmin) {
        return {
          allowed: false,
          reason: 'role_forbidden',
          message: 'Se requieren permisos de Propietario o Administrador para configurar la marca y dominios.',
        };
      }
      return { allowed: true };

    case 'manage_smart_courts':
      if (plan !== 'elite') {
        return {
          allowed: false,
          reason: 'plan_limit',
          requiredPlan: 'elite',
          message: 'La automatización IoT de iluminación y cerraduras inteligentes requiere el Plan ELITE.',
        };
      }
      if (!ownerOrAdmin && role !== 'RECEPTION') {
        return { allowed: false, reason: 'role_forbidden' };
      }
      return { allowed: true };

    case 'manage_pos_cafe':
      if (plan !== 'elite') {
        return {
          allowed: false,
          reason: 'plan_limit',
          requiredPlan: 'elite',
          message: 'El módulo TPV y Cafetería requiere el Plan ELITE.',
        };
      }
      if (!ownerOrAdmin && role !== 'RECEPTION' && role !== 'STORE_MANAGER') {
        return { allowed: false, reason: 'role_forbidden' };
      }
      return { allowed: true };

    case 'manage_academy':
      if (tenantType !== 'PADEL_CLUB' && tenantType !== 'ACADEMY' && tenantType !== 'COACH') {
        return {
          allowed: false,
          reason: 'tenant_type_mismatch',
          message: 'Este módulo no aplica para este tipo de negocio.',
        };
      }
      if (!ownerOrAdmin && role !== 'COACH' && role !== 'ACADEMY_MANAGER') {
        return { allowed: false, reason: 'role_forbidden' };
      }
      return { allowed: true };

    case 'manage_tournaments':
      if (tenantType !== 'PADEL_CLUB' && tenantType !== 'TOURNAMENT_ORGANIZER') {
        return {
          allowed: false,
          reason: 'tenant_type_mismatch',
          message: 'Este módulo solo está activo para Clubes u Organizadores de Torneos.',
        };
      }
      if (!ownerOrAdmin && role !== 'TOURNAMENT_ORGANIZER') {
        return { allowed: false, reason: 'role_forbidden' };
      }
      return { allowed: true };

    case 'manage_shop':
      if (!ownerOrAdmin && role !== 'STORE_MANAGER') {
        return { allowed: false, reason: 'role_forbidden' };
      }
      return { allowed: true };

    case 'view_agenda':
    case 'manage_courts':
    case 'manage_bookings':
      if (tenantType !== 'PADEL_CLUB') {
        return {
          allowed: false,
          reason: 'tenant_type_mismatch',
          message: 'La agenda de pistas solo está activa para clubes deportivos.',
        };
      }
      if (!ownerOrAdmin && role !== 'RECEPTION' && role !== 'COACH') {
        return { allowed: false, reason: 'role_forbidden' };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}
