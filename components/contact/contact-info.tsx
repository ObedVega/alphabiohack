/**
 * Componente Presentacional de Información de Contacto
 *
 * Componente reutilizable que muestra la información de contacto
 * usando las traducciones de next-intl.
 */

"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import { BusinessHours } from "@/components/contact/business-hours";
import { InfoCard } from "@/components/contact/info-card";
import { useTranslations } from "next-intl";
import { useUser } from "@/contexts/user-context";

interface ContactInfoProps {
  readonly className?: string;
}

export function ContactInfo({ className }: ContactInfoProps) {
  const t = useTranslations("Contact");
  const { prismaUser } = useUser();

  // Obtener el número de teléfono del usuario o usar el del JSON como fallback
  const phoneNumber = prismaUser?.telefono || t("phoneNumber");
  const address = prismaUser?.informacionPublica || t("address");

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Dirección */}
      <InfoCard
        icon={<MapPin className="h-6 w-6 text-blue-600" />}
        title={t("address")}
      >
        <p className="">{address}</p>
      </InfoCard>

      {/* Teléfono */}
      <InfoCard
        icon={<Phone className="h-6 w-6 text-blue-600" />}
        title={t("phone")}
      >
        <p className="">{phoneNumber}</p>
      </InfoCard>

      {/* Email */}
      <InfoCard
        icon={<Mail className="h-6 w-6 text-blue-600" />}
        title={t("email")}
      >
        <p className="">{t("emailAddress")}</p>
      </InfoCard>

      {/* Horarios de Atención */}
      <BusinessHours />
    </div>
  );
}
