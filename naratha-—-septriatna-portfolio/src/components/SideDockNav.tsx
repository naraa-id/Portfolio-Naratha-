import React, { useEffect, useState } from 'react';
import {
  Building2,
  Database,
  Feather,
  Layers,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';
import { SectionId } from '../types';

interface SideDockNavProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  onOpenDataManager: () => void;
  onSignOut: () => void;
  isAdmin: boolean;
  projectCount: number;
  poemCount: number;
}

const NAV_ITEMS: {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'portfolio', label: 'Portfolio', icon: Building2 },
  { id: 'aplikasi', label: 'Aplikasi & SaaS', icon: Layers },
  { id: 'puisi', label: 'Ruang Puisi', icon: Feather },
  { id: 'tentang', label: 'Tentang Saya', icon: User },
];

export const SideDockNav: React.FC<SideDockNavProps> = ({
  activeSection,
  onNavigate,
  onOpenDataManager,
  onSignOut,
  isAdmin,
  projectCount,
  poemCount,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLinkClick = (id: SectionId) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Mobile & Tablet Top Bar (compact <= 56px) */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleLinkClick('beranda')}
          className="text-lg font-bold tracking-tight text-[#F4F4F5] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C] rounded-sm px-1"
        >
          NARATHA
        </button>

        <button
          type="button"
          aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-11 h-11 flex items-center justify-center text-zinc-200 hover:text-white rounded-lg border border-zinc-800 bg-[#121215] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative ml-auto w-72 max-w-[85vw] h-full bg-[#0C0C0E] border-l border-zinc-800 p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => handleLinkClick('beranda')}
                  className="text-xl font-bold tracking-tight text-white whitespace-nowrap"
                >
                  NARATHA
                </button>
                <button
                  type="button"
                  aria-label="Tutup menu"
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg border border-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav
                className="mt-6 flex flex-col gap-1"
                aria-label="Navigasi Utama Mobile"
              >
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleLinkClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-left whitespace-nowrap ${
                        isActive
                          ? 'bg-[#18181C] text-[#E5A93C]'
                          : 'text-zinc-300 hover:bg-[#141418] hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-zinc-800/80 space-y-3">
              <div className="text-xs text-zinc-500 flex items-center gap-2 tabular-nums">
                <span>{projectCount} Proyek</span>
                <span aria-hidden="true">·</span>
                <span>{poemCount} Puisi</span>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenDataManager();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#E5A93C] text-[#09090B] hover:bg-[#F0B94E] transition-colors whitespace-nowrap"
                  >
                    <Database className="w-4 h-4" />
                    <span>Dashboard Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Mode Admin</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Floating Side Navigation Dock */}
      <aside
        aria-label="Navigasi Samping Desktop"
        className="hidden lg:flex fixed left-5 top-5 bottom-5 w-60 z-30 flex-col justify-between bg-[#0E0E11]/95 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6"
      >
        <div>
          <button
            type="button"
            onClick={() => handleLinkClick('beranda')}
            className="text-xl font-bold tracking-tight text-[#F4F4F5] hover:text-[#E5A93C] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C] rounded-sm"
          >
            NARATHA
          </button>

          <div className="mt-8 pt-6 border-t border-zinc-800/70">
            <nav className="flex flex-col gap-1.5" aria-label="Menu Utama">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleLinkClick(item.id)}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C] ${
                      isActive
                        ? 'bg-[#18181D] text-[#E5A93C]'
                        : 'text-zinc-400 hover:bg-[#141418] hover:text-zinc-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#E5A93C]'
                            : 'text-zinc-500 group-hover:text-zinc-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/70 space-y-3">
          <div className="text-xs text-zinc-500 flex items-center gap-2 tabular-nums">
            <span>{projectCount} Proyek</span>
            <span aria-hidden="true">·</span>
            <span>{poemCount} Puisi</span>
          </div>

          {isAdmin ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenDataManager}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#E5A93C] text-[#09090B] hover:bg-[#F0B94E] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
              >
                <Database className="w-4 h-4 shrink-0" />
                <span>Dashboard Admin</span>
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Keluar Admin</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 leading-relaxed">
              Arsitektur · Konstruksi · SaaS · Sastra
            </p>
          )}
        </div>
      </aside>
    </>
  );
};
