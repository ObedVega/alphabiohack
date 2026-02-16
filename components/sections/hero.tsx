"use client"

import { CalendarDays, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { useUser } from "@/contexts/user-context";

export function HeroSection() {
  const t = useTranslations('Hero');
  const { prismaUser, loading } = useUser();
  
  // Usar el avatar del usuario si existe
  const imageSource = prismaUser?.avatar || "";
  
  // Datos directamente de BD, sin fallbacks
  const fullName = prismaUser ? `${prismaUser.firstname} ${prismaUser.lastname}` : "";
  const especialidad = (prismaUser as { especialidad?: string | null })?.especialidad || "";
  const summary = (prismaUser as { summary?: string | null })?.summary || "";
  
  return (
    <section className="bg-linear-to-br from-background to-muted py-20 lg:py-32" suppressHydrationWarning>
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                <span className="text-primary">Hello, I`m {fullName}</span>
                <br />
                <span className="text-foreground">{especialidad}</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-lg">
                {summary}
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-xs border border-border">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  
                  <Select >
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder={t('locationPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="albuquerque">{t('locations.albuquerque')}</SelectItem>
                      <SelectItem value="dallas">{t('locations.dallas')}</SelectItem>
                      <SelectItem value="phoenix">{t('locations.phoenix')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Link href="/booking" className="w-full cursor-pointer">
                  <Button className="w-full cursor-pointer">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {t('bookNow')}
                </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content - Doctor Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-primary rounded-full transform scale-110 opacity-20"></div>
              <div className="relative bg-primary rounded-full p-8">
               
                  {imageSource && (
                    <Image
                      src={imageSource}
                      alt={`${fullName} profile`}
                      className="w-full h-auto rounded-full object-cover"
                      width={500}
                      height={500}
                    />
                  )}
                
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </section>
  )
}
