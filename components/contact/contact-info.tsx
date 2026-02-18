/**
 * Componente Presentacional de Información de Contacto
 *
 * Componente reutilizable que muestra la información de contacto
 * usando las traducciones de next-intl.
 */

"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";

import { BusinessHours } from "@/components/contact/business-hours";
import { InfoCard } from "@/components/contact/info-card";
import { useTranslations } from "next-intl";
import { useUser } from "@/contexts/user-context";
import { ContactInfoSkeleton } from "@/components/contact/contact-info-skeleton";

interface ContactData {
  telefono?: string | null;
  informacionPublica?: string | null;
  weekdaysHours?: string | null;
  saturdayHours?: string | null;
  sundayHours?: string | null;
}

interface ContactInfoProps {
  readonly className?: string;
}

export function ContactInfo({ className }: ContactInfoProps) {
  const t = useTranslations("Contact");
  const { prismaUser, loading: authLoading, isAuthenticated } = useUser();
  const [publicData, setPublicData] = useState<ContactData | null>(null);
  const [publicLoading, setPublicLoading] = useState(true);

  // Cuando no estamos autenticados, traer datos públicos
  useEffect(() => {
    if (!isAuthenticated) {
      const fetchPublicContact = async () => {
        try {
          const response = await fetch("/api/public/contact");
          if (response.ok) {
            const data = await response.json();
            setPublicData(data);
          }
        } catch (error) {
          console.error("Error fetching public contact data:", error);
        } finally {
          setPublicLoading(false);
        }
      };
      fetchPublicContact();
    }
  }, [isAuthenticated]);

  // Determinar si estamos cargando
  const loading = isAuthenticated ? authLoading : publicLoading;

  // Usar datos autenticados si existen, sino usar públicos
  const contactData = isAuthenticated ? prismaUser : publicData;

  // Mostrar loader mientras carga
  if (loading || !contactData) {
    return (
      <div className={`${className || ""}`}>
        <ContactInfoSkeleton />
      </div>
    );
  }

  // Mostrar solo datos de BD, sin fallbacks
  const phoneNumber = contactData?.telefono || "";
  const address = contactData?.informacionPublica || "";

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Dirección */}
      {address && (
        <InfoCard
          icon={<MapPin className="h-6 w-6 text-blue-600" />}
          title={t("address")}
        >
          <p className="">{address}</p>
        </InfoCard>
      )}

      {/* Teléfono */}
      {phoneNumber && (
        <InfoCard
          icon={<Phone className="h-6 w-6 text-blue-600" />}
          title={t("phone")}
        >
          <p className="">{phoneNumber}</p>
        </InfoCard>
      )}

      {/* Email */}
      <InfoCard
        icon={<Mail className="h-6 w-6 text-blue-600" />}
        title={t("email")}
      >
        <p className="">{t("emailAddress")}</p>
      </InfoCard>

      {/* Horarios de Atención */}
      <BusinessHours 
        weekdaysHours={contactData?.weekdaysHours}
        saturdayHours={contactData?.saturdayHours}
        sundayHours={contactData?.sundayHours}
      />
    </div>
  );
}
