import { buildGoogleCalendarUrl, buildICS } from "@/lib/utils/calendar-links";
import { AppointmentInviteEmail } from "@/emails/appointment-invite";

// ❌ YA NO IMPORTAMOS PST_TZ
// import { PST_TZ } from "@/lib/utils/timezone";

export interface TherapistInvitePayload {
  patientName: string;
  patientEmail: string;
  therapistName: string;
  locationAddress: string;
  notes?: string;
  start: Date;
  end: Date;
  language: "es" | "en";
  bookingId: string;
  organizerEmail?: string;
  attendeeEmail: string;

  // ❌ antes opcional
  // timeZone?: string;

  // ✅ ahora obligatorio
  timeZone: string;
}

export function buildTherapistInviteArtifacts(payload: TherapistInvitePayload) {
  const {
    patientName,
    patientEmail,
    therapistName,
    locationAddress,
    notes,
    start,
    end,
    language,
    bookingId,
    organizerEmail,
    attendeeEmail,
    timeZone,
  } = payload;

  // ✅ Guardrail correcto (puedes dejarlo o quitarlo si confías en el tipo)
  if (!timeZone) {
    throw new Error("timeZone is required to build calendar artifacts");
  }

  // ❌ ANTES (fallback peligroso)
  // timeZone: timeZone || PST_TZ

  // ✅ AHORA (timezone explícito)
  const startHHmm = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(start);

  const endHHmm = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(end);

  const googleCalendarUrl = buildGoogleCalendarUrl(
    {
      title: `Cita con ${patientName}`,
      description: notes || "",
      location: locationAddress,
      date: start,
      startTimeHHmm: startHHmm,
      endTimeHHmm: endHHmm,
    },
    timeZone // ✅ SIN fallback
  );

  const icsContent = buildICS(
    {
      uid: `booking-${bookingId}@booking-saas`,
      organizerEmail:
        organizerEmail ||
        process.env.BOOKING_FROM_EMAIL ||
        "no-reply@booking-saas.com",
      attendeeEmail,
      title: `Cita con ${patientName}`,
      description: notes || "",
      location: locationAddress,
      date: start,
      startTimeHHmm: startHHmm,
      endTimeHHmm: endHHmm,
    },
    timeZone // ✅ SIN fallback
  );

  const reactProps = AppointmentInviteEmail({
    patientName,
    patientEmail,
    therapistName,
    locationAddress,
    notes,
    start,
    end,
    googleCalendarUrl,
    language,
    timeZone, // ✅ AHORA SÍ SE PASA
  });

  const subject = `Nueva cita: ${patientName}`;

  return { googleCalendarUrl, icsContent, reactProps, subject };
}
