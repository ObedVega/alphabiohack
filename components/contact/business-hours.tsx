"use client";

import { useTranslations } from "next-intl";
import { useUser } from "@/contexts/user-context";

interface BusinessHoursProps {
  weekdays?: string;
  saturday?: string;
  sunday?: string;
  className?: string;
}

interface UserBusinessHours {
  weekdaysHours?: string;
  saturdayHours?: string;
  sundayHours?: string;
}

export function BusinessHours({
  weekdays,
  saturday,
  sunday,
  className,
}: BusinessHoursProps) {
  const t = useTranslations('Contact');
  const { prismaUser } = useUser();

  const user = prismaUser as UserBusinessHours | null;

  // Usar datos del usuario si están disponibles, si no usar los props por defecto
  const weekdaysHours = user?.weekdaysHours || weekdays || "9:00 AM - 6:00 PM";
  const saturdayHours = user?.saturdayHours || saturday || "9:00 AM - 2:00 PM";
  const sundayHours = user?.sundayHours || sunday || "Closed";

  return (
    <div className={`p-6 rounded-lg bg-card text-card-foreground ${className || ''}`}>
      <h3 className="font-semibold mb-3 text-foreground">{t('businessHours')}</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p><span className="font-medium text-foreground">{t('weekdays')}:</span> {weekdaysHours}</p>
        <p><span className="font-medium text-foreground">{t('saturday')}:</span> {saturdayHours}</p>
        <p><span className="font-medium text-foreground">{t('sunday')}:</span> {sundayHours}</p>
      </div>
    </div>
  );
}


