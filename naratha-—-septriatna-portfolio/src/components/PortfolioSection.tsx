import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  MapPin,
  Pencil,
  Plus,
  Ruler,
  X,
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';

interface PortfolioSectionProps {
  projects: Project[];
  isAdmin: boolean;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
}

type FilterOption = 'Semua' | ProjectCategory;

const FILTER_OPTIONS: FilterOption[] = [
  'Semua',
  'Arsitektur',
  'Konstruksi Lapangan',
  'Perencanaan RAB',
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  projects,
  isAdmin,
  onAddProject,
  onEditProject,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterOption>('Semua');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects =
    selectedCategory === 'Semua'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="portfolio"
      className="py-16 lg:py-20 border-b border-zinc-800/80 scroll-mt-16 lg:scroll-mt-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs text-[#E5A93C] font-medium tracking-wide">
            01. Karya Terpilih
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Portfolio Arsitektur &amp; Konstruksi
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Dokumentasi perancangan kawasan hunian, gambar kerja drafter,
            pengawasan struktur di lapangan, hingga perencanaan anggaran biaya.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={onAddProject}
            className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-lg border border-zinc-700 bg-[#121215] text-sm font-medium text-zinc-100 hover:border-[#E5A93C] hover:text-[#E5A93C] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah Proyek</span>
          </button>
        )}
      </div>

      {/* Category Filter Segmented Control */}
      <div
        className="mt-8 flex flex-wrap items-center gap-1.5 p-1.5 bg-[#111114] border border-zinc-800/80 rounded-xl w-fit max-w-full"
        role="tablist"
        aria-label="Filter kategori proyek"
      >
        {FILTER_OPTIONS.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C] ${
                isActive
                  ? 'bg-[#E5A93C] text-[#09090B]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#18181D]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-zinc-800/80 bg-[#111114] p-10 text-center">
          <p className="text-base font-medium text-zinc-200">
            Belum ada proyek di kategori &ldquo;{selectedCategory}&rdquo;.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Pilih kategori lain untuk melihat karya arsitektur dan konstruksi.
          </p>
          {isAdmin && (
            <button
              type="button"
              onClick={onAddProject}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek Baru</span>
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const isHeroTile =
              selectedCategory === 'Semua' && index === 0 && project.featured;
            const isBroken = brokenImages[project.id] || !project.imageUrl;

            return (
              <article
                key={project.id}
                className={`group rounded-2xl border border-zinc-800/80 bg-[#111114] overflow-hidden flex flex-col transition-colors hover:border-zinc-700 ${
                  isHeroTile ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Clickable Image Thumbnail */}
                <button
                  type="button"
                  onClick={() => setActiveProject(project)}
                  className={`relative w-full text-left overflow-hidden bg-[#16161B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C] ${
                    isHeroTile ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  {!isBroken ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(project.id)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#191920] to-[#0E0E11] text-center">
                      <Building2 className="w-8 h-8 text-[#E5A93C] mb-2" />
                      <span className="text-sm font-medium text-zinc-200">
                        {project.title}
                      </span>
                      <span className="text-xs text-zinc-500 mt-1">
                        {project.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-100 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                      <span>Detail</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span className="text-[#E5A93C] font-medium">
                        {project.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{project.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{project.area}</span>
                    </div>

                    <h3 className="mt-2.5 text-lg sm:text-xl font-semibold text-white leading-snug">
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="text-left hover:text-[#E5A93C] transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {project.title}
                      </button>
                    </h3>

                    <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-800/70 flex items-center justify-between gap-4 text-xs">
                    <span className="text-zinc-300 font-mono tabular-nums">
                      {project.budgetSummary}
                    </span>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => onEditProject(project)}
                        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors whitespace-nowrap"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="text-zinc-400 hover:text-[#E5A93C] transition-colors whitespace-nowrap"
                      >
                        Lihat Spesifikasi
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox & Project Detail Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveProject(null)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#111114] text-zinc-100 shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#111114]/95 backdrop-blur-md border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-[#E5A93C] font-medium">
                  {activeProject.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activeProject.year}</span>
              </div>
              <button
                type="button"
                aria-label="Tutup detail proyek"
                onClick={() => setActiveProject(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-800 bg-[#16161B]">
                {!brokenImages[activeProject.id] && activeProject.imageUrl ? (
                  <img
                    src={activeProject.imageUrl}
                    alt={activeProject.title}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(activeProject.id)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#191920] to-[#0E0E11] p-6">
                    <Building2 className="w-10 h-10 text-[#E5A93C] mb-2" />
                    <p className="text-sm text-zinc-300">{activeProject.title}</p>
                  </div>
                )}
              </div>

              <div>
                <h3
                  id="modal-project-title"
                  className="text-2xl font-bold text-white"
                >
                  {activeProject.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {activeProject.summary}
                </p>
              </div>

              {/* Technical Spec Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80">
                <div>
                  <p className="text-xs text-zinc-500">Lokasi &amp; Klien</p>
                  <p className="mt-1 text-sm font-medium text-zinc-100">
                    {activeProject.location}
                  </p>
                  <p className="text-xs text-zinc-400">{activeProject.client}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Luas / Skala</p>
                  <p className="mt-1 text-sm font-medium text-zinc-100 tabular-nums">
                    {activeProject.area}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Nilai / Lingkup</p>
                  <p className="mt-1 text-sm font-mono font-medium text-[#E5A93C] tabular-nums">
                    {activeProject.budgetSummary}
                  </p>
                </div>
              </div>

              {/* Deliverables */}
              <div className="pt-4 border-t border-zinc-800/80">
                <p className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Hasil Pekerjaan (Deliverables)</span>
                </p>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-zinc-200">
                  {activeProject.deliverables.map((item, idx) => (
                    <li
                      key={idx}
                      className="px-3.5 py-2.5 rounded-lg bg-[#16161A] border border-zinc-800/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = activeProject;
                      setActiveProject(null);
                      onEditProject(target);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit Proyek Ini</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="px-4 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
