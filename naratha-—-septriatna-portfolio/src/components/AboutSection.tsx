import React, { useState } from 'react';
import { Check, Copy, Database, Lock, LogOut, Mail, Pencil } from 'lucide-react';
import { SiteProfile } from '../types';

interface AboutSectionProps {
  profile: SiteProfile;
  isAdmin: boolean;
  signedInEmail: string | null;
  authNotice: string | null;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenDataManager: () => void;
  onEditProfile: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  isAdmin,
  signedInEmail,
  authNotice,
  onAdminLogin,
  onAdminLogout,
  onOpenDataManager,
  onEditProfile,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <>
      <section
        id="tentang"
        className="py-16 lg:py-20 scroll-mt-16 lg:scroll-mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[#E5A93C] font-medium tracking-wide">
                04. Tentang Saya
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="inline-flex items-center gap-1.5 text-xs text-[#E5A93C] hover:text-[#F0B94E] transition-colors whitespace-nowrap"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Profil</span>
                </button>
              )}
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {profile.aboutHeading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              {profile.aboutBio}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Hubungi via Email</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-[#121215] text-sm font-medium text-zinc-200 hover:border-zinc-500 transition-colors whitespace-nowrap"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-[#E5A93C]" />
                    <span className="text-[#E5A93C]">Email Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{profile.contactEmail}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-6">
              <p className="text-xs text-[#E5A93C] font-medium">Pilar 01</p>
              <h3 className="mt-2 text-base font-semibold text-white">
                {profile.pillar1Title}
              </h3>
              <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
                {profile.pillar1Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-6">
              <p className="text-xs text-[#E5A93C] font-medium">Pilar 02</p>
              <h3 className="mt-2 text-base font-semibold text-white">
                {profile.pillar2Title}
              </h3>
              <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
                {profile.pillar2Desc}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-6">
              <p className="text-xs text-[#E5A93C] font-medium">Pilar 03</p>
              <h3 className="mt-2 text-base font-semibold text-white">
                {profile.pillar3Title}
              </h3>
              <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
                {profile.pillar3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer with Discreet Admin Sign-In */}
      <footer className="pt-8 pb-10 border-t border-zinc-800/80 space-y-3">
        {authNotice && (
          <div className="rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-3">
            <span>{authNotice}</span>
            {signedInEmail && !isAdmin && (
              <button
                type="button"
                onClick={onAdminLogout}
                className="inline-flex items-center gap-1.5 text-amber-100 underline hover:text-white"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar ({signedInEmail})</span>
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} NARATHA · Septriatna. Portofolio
            Arsitektur, Konstruksi, SaaS &amp; Sastra.
          </p>

          {isAdmin ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenDataManager}
                className="inline-flex items-center gap-1.5 text-[#E5A93C] hover:text-[#F0B94E] transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Dashboard Admin ({signedInEmail})</span>
              </button>
              <button
                type="button"
                onClick={onAdminLogout}
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : signedInEmail ? (
            <button
              type="button"
              onClick={onAdminLogout}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar ({signedInEmail})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onAdminLogin}
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Masuk Admin</span>
            </button>
          )}
        </div>
      </footer>
    </>
  );
};
