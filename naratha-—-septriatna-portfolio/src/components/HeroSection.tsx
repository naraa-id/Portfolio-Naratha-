import React, { useEffect, useState } from 'react';
import { ArrowRight, Building2, Layers, Pencil } from 'lucide-react';
import { SectionId, SiteProfile } from '../types';

interface HeroSectionProps {
  profile: SiteProfile;
  isAdmin: boolean;
  onEditProfile: () => void;
  onNavigate: (section: SectionId) => void;
  projectCount: number;
  saasCount: number;
  poemCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  isAdmin,
  onEditProfile,
  onNavigate,
  projectCount,
  saasCount,
  poemCount,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [profile.heroImageUrl]);

  return (
    <section
      id="beranda"
      className="pt-8 pb-16 lg:pt-10 lg:pb-20 border-b border-zinc-800/80"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Editorial Headline & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-xs sm:text-sm text-zinc-400 tracking-wide">
                {profile.heroKicker}
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="inline-flex items-center gap-1.5 text-xs text-[#E5A93C] hover:text-[#F0B94E] transition-colors whitespace-nowrap"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Hero</span>
                </button>
              )}
            </div>

            <h1 className="text-[clamp(2.25rem,3.8vw,3.4rem)] font-bold tracking-tight leading-[1.12] text-[#F4F4F5] text-balance">
              {profile.heroTitle}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-[58ch]">
              {profile.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
            >
              <span>Lihat Portofolio</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('aplikasi')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-700 bg-[#121215] text-zinc-100 text-sm font-medium hover:border-zinc-500 hover:bg-[#18181D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
            >
              <Layers className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>Katalog Aplikasi</span>
            </button>
          </div>
        </div>

        {/* Right Column: Matching-Height Architectural Visual */}
        <div className="lg:col-span-6">
          <div className="relative h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#111114]">
            {!imgError && profile.heroImageUrl ? (
              <img
                src={profile.heroImageUrl}
                alt={profile.heroImageCaption}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#16161B] to-[#0B0B0D] text-center">
                <Building2 className="w-10 h-10 text-[#E5A93C] mb-3" />
                <p className="text-sm font-medium text-zinc-200">
                  Studio Arsitektur &amp; Rekayasa Naratha
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Desain Hunian · Gambar Kerja · Konstruksi Lapangan
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-2 text-xs text-zinc-300">
              <span>{profile.heroImageCaption}</span>
              <span className="text-zinc-400">{profile.heroImageLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Quantitative Practice Strip Below Split */}
      <div className="mt-10 pt-8 border-t border-zinc-800/70 grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {projectCount}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Karya Arsitektur &amp; Konstruksi
          </p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {saasCount}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Aplikasi Bisnis &amp; SaaS Aktif
          </p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            AHSP / BoQ
          </p>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Perencanaan RAB Terstruktur
          </p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {poemCount}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Naskah Puisi Ruang Sastra
          </p>
        </div>
      </div>
    </section>
  );
};
