import React, { useEffect, useState } from 'react';
import { CustomerItem, UserSession } from '../../context/AppContext';

const CLUB_PLAYER_AVATARS: Record<string, string> = {
  'carlos mendez': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  'carlos m.': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  'diego soto': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'ana belen vazquez': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'javier fraga': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'elena permuy': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'ruben loureiro': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'mateo varela': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'laura senra': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'rosa carballo': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'paula loureiro': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
  'marcos soto': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'gonzalo barreiro': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'adrian dominguez': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'david castro': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'lucas pineiro': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'pablo vello': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'borja prieto': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'alfonso bouza': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'sergio estevez': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'hugo ramos': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'david freire': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'carlos arias': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  'carla noche': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
  'roberto diaz': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'juan perez': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'daniel silva': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'fernando gomez': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'lucia dominguez': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'brais quintana': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'lucia casal': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'marcos seijo': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'marcos varela': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'alejandro ramos': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'patricia romero': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'ivan gomez': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'adrian pena': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'nacho castro': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
};

const normalizePlayerKey = (name: string): string =>
  name
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

export const getInitials = (name: string): string => {
  const clean = name.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  if (!clean) return 'JG';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

export const resolvePlayerAvatarUrl = (
  name: string,
  explicitAvatar?: string,
  customers?: CustomerItem[],
  currentUser?: UserSession | null
): string | undefined => {
  if (explicitAvatar && explicitAvatar.trim().length > 0) {
    return explicitAvatar.trim();
  }

  const key = normalizePlayerKey(name);
  if (!key) return undefined;

  if (currentUser && currentUser.avatarUrl && normalizePlayerKey(currentUser.name) === key) {
    return currentUser.avatarUrl;
  }

  if (customers && customers.length > 0) {
    const matched = customers.find((c) => normalizePlayerKey(c.name) === key);
    if (matched?.avatarUrl && matched.avatarUrl.trim().length > 0) {
      return matched.avatarUrl.trim();
    }
  }

  return CLUB_PLAYER_AVATARS[key];
};

interface PlayerAvatarProps {
  name: string;
  avatar?: string;
  customers?: CustomerItem[];
  currentUser?: UserSession | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<PlayerAvatarProps['size']>, string> = {
  xs: 'w-7 h-7 rounded-lg text-[10px]',
  sm: 'w-9 h-9 rounded-xl text-xs',
  md: 'w-10 h-10 rounded-xl text-xs',
  lg: 'w-11 h-11 rounded-2xl text-sm',
};

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  avatar,
  customers,
  currentUser,
  size = 'sm',
  className = '',
}) => {
  const resolvedSrc = resolvePlayerAvatarUrl(name, avatar, customers, currentUser);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [resolvedSrc]);

  const sizeClass = SIZE_CLASSES[size];

  if (resolvedSrc && !imgError) {
    return (
      <img
        src={resolvedSrc}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${sizeClass} object-cover shrink-0 border border-slate-200/80 dark:border-[#1A314D] bg-slate-100 dark:bg-[#0E2239] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} bg-[#0B1A2D] dark:bg-[#0E2239] text-white border border-slate-200/80 dark:border-[#1A314D] font-bold flex items-center justify-center shrink-0 select-none ${className}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
};

// =============================================================================
// SAFE DATE & TIME FORMATTERS (Zero "Invalid Date" or "NaN")
// =============================================================================

interface ParsedDateParts {
  hasExplicitDate: boolean;
  dateObj: Date;
  timeHm?: string;
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const parseSafeDateParts = (raw?: string): ParsedDateParts => {
  const fallbackNow = new Date();
  if (!raw || typeof raw !== 'string') {
    return { hasExplicitDate: false, dateObj: fallbackNow };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { hasExplicitDate: false, dateObj: fallbackNow };
  }

  // Case 1: Time-only string e.g. "18:00" or "18:00:00"
  const timeOnlyMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeOnlyMatch) {
    const hh = Math.min(23, Math.max(0, Number(timeOnlyMatch[1])));
    const mm = Math.min(59, Math.max(0, Number(timeOnlyMatch[2])));
    const todayWithTime = new Date(
      fallbackNow.getFullYear(),
      fallbackNow.getMonth(),
      fallbackNow.getDate(),
      hh,
      mm,
      0
    );
    return {
      hasExplicitDate: false,
      dateObj: todayWithTime,
      timeHm: `${pad2(hh)}:${pad2(mm)}`,
    };
  }

  // Case 2: ISO-like "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm..." or "YYYY-MM-DD HH:mm..."
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const hh = isoMatch[4] !== undefined ? Math.min(23, Math.max(0, Number(isoMatch[4]))) : 12;
    const mm = isoMatch[5] !== undefined ? Math.min(59, Math.max(0, Number(isoMatch[5]))) : 0;

    const candidate = new Date(year, month - 1, day, hh, mm, 0);
    if (
      !isNaN(candidate.getTime()) &&
      candidate.getFullYear() === year &&
      candidate.getMonth() === month - 1 &&
      candidate.getDate() === day
    ) {
      return {
        hasExplicitDate: true,
        dateObj: candidate,
        timeHm: isoMatch[4] !== undefined ? `${pad2(hh)}:${pad2(mm)}` : undefined,
      };
    }
  }

  // Case 3: European "DD/MM/YYYY" or "DD-MM-YYYY"
  const euMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[T\s](\d{1,2}):(\d{2}))?/);
  if (euMatch) {
    const day = Number(euMatch[1]);
    const month = Number(euMatch[2]);
    const year = Number(euMatch[3]);
    const hh = euMatch[4] !== undefined ? Math.min(23, Math.max(0, Number(euMatch[4]))) : 12;
    const mm = euMatch[5] !== undefined ? Math.min(59, Math.max(0, Number(euMatch[5]))) : 0;

    const candidate = new Date(year, month - 1, day, hh, mm, 0);
    if (
      !isNaN(candidate.getTime()) &&
      candidate.getFullYear() === year &&
      candidate.getMonth() === month - 1 &&
      candidate.getDate() === day
    ) {
      return {
        hasExplicitDate: true,
        dateObj: candidate,
        timeHm: euMatch[4] !== undefined ? `${pad2(hh)}:${pad2(mm)}` : undefined,
      };
    }
  }

  // Case 4: Generic Date fallback if valid
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return {
      hasExplicitDate: true,
      dateObj: parsed,
      timeHm: `${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`,
    };
  }

  // Case 5: Relative or textual strings (e.g., "Hoy")
  const timeInText = trimmed.match(/(\d{1,2}):(\d{2})/);
  return {
    hasExplicitDate: false,
    dateObj: fallbackNow,
    timeHm: timeInText ? `${pad2(Number(timeInText[1]))}:${pad2(Number(timeInText[2]))}` : undefined,
  };
};

export const formatModalDateEs = (
  raw?: string,
  options?: { compact?: boolean; language?: string }
): string => {
  const locale = options?.language === 'en' ? 'en-US' : 'es-ES';
  const { hasExplicitDate, dateObj } = parseSafeDateParts(raw);

  const weekday = dateObj.toLocaleDateString(locale, { weekday: options?.compact ? 'short' : 'long' });
  const month = dateObj.toLocaleDateString(locale, { month: options?.compact ? 'short' : 'long' });
  const capWeekday = (weekday.charAt(0).toUpperCase() + weekday.slice(1)).replace(/\.$/, '');
  const capMonth = (month.charAt(0).toUpperCase() + month.slice(1)).replace(/\.$/, '');
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  if (!hasExplicitDate) {
    const todayPrefix = options?.language === 'en' ? 'Today' : 'Hoy';
    return options?.compact
      ? `${todayPrefix} · ${capWeekday}, ${day} ${capMonth}`
      : `${todayPrefix} · ${capWeekday}, ${day} de ${capMonth}`;
  }

  if (options?.compact) {
    return `${capWeekday}, ${day} ${capMonth} ${year}`;
  }

  return locale === 'en-US'
    ? `${capWeekday}, ${capMonth} ${day}, ${year}`
    : `${capWeekday}, ${day} de ${capMonth}, ${year}`;
};

export const extractIsoDateSafe = (raw?: string): string => {
  const { dateObj } = parseSafeDateParts(raw);
  return `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`;
};

export const extractTimeHmSafe = (raw?: string, fallback = '18:00'): string => {
  const { timeHm } = parseSafeDateParts(raw);
  return timeHm || fallback;
};

export const formatTimeRangeSafe = (
  startTime?: string,
  endTime?: string,
  fallbackSlot?: string
): string => {
  const startHm = extractTimeHmSafe(startTime, '');
  const endHm = endTime ? extractTimeHmSafe(endTime, '') : '';
  if (startHm && endHm) return `${startHm} - ${endHm}`;
  if (startHm) return startHm;
  if (fallbackSlot && fallbackSlot.trim()) return fallbackSlot.trim();
  return '18:00';
};

export const formatMatchTimeWithDurationSafe = (
  startTimeStr?: string,
  durationMinutes: number = 90
): string => {
  const timePart = extractTimeHmSafe(startTimeStr, '19:30');
  const [hStr, mStr] = timePart.split(':');
  const startH = parseInt(hStr || '19', 10);
  const startM = parseInt(mStr || '30', 10);
  const safeDuration = Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : 90;

  const totalStartMinutes = (Number.isFinite(startH) ? startH : 19) * 60 + (Number.isFinite(startM) ? startM : 30);
  const totalEndMinutes = totalStartMinutes + safeDuration;

  const endH = Math.floor(totalEndMinutes / 60) % 24;
  const endM = totalEndMinutes % 60;
  const endTimePart = `${pad2(endH)}:${pad2(endM)}`;

  const durH = Math.floor(safeDuration / 60);
  const durM = safeDuration % 60;
  const durationLabel =
    durM > 0 ? (durH > 0 ? `${durH}h ${durM}m` : `${durM}m`) : `${durH}h`;

  return `${timePart} - ${endTimePart} (${durationLabel})`;
};
