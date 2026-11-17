import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Feather,
  Pencil,
  Plus,
  Shuffle,
  X,
} from 'lucide-react';
import { Poem } from '../types';

interface PoetrySectionProps {
  poems: Poem[];
  isAdmin: boolean;
  onAddPoem: () => void;
  onEditPoem: (poem: Poem) => void;
}

export const PoetrySection: React.FC<PoetrySectionProps> = ({
  poems,
  isAdmin,
  onAddPoem,
  onEditPoem,
}) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [activePoem, setActivePoem] = useState<Poem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (poems.length > 0 && featuredIndex >= poems.length) {
      setFeaturedIndex(0);
    }
  }, [poems.length, featuredIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePoem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const featuredPoem = poems[featuredIndex] ?? null;

  const handleRandomInspiration = () => {
    if (poems.length <= 1) return;
    let nextIdx = featuredIndex;
    while (nextIdx === featuredIndex) {
      nextIdx = Math.floor(Math.random() * poems.length);
    }
    setFeaturedIndex(nextIdx);
  };

  const handleCopyQuote = async (poem: Poem) => {
    const text = `"${poem.excerpt}" — ${poem.title}, Septriatna (Naratha)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(poem.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard blocked in restricted contexts; fail gracefully
    }
  };

  return (
    <section
      id="puisi"
      className="py-16 lg:py-20 border-b border-zinc-800/80 scroll-mt-16 lg:scroll-mt-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs text-[#E5A93C] font-medium tracking-wide">
            03. Ruang Puisi &amp; Koleksi Sastra
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Catatan Sunyi di Sela Proyek
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Kumpulan bait puisi pribadi tentang ruang, ketekunan di lapangan,
            hujan, dan jeda yang menyertai setiap proses penciptaan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleRandomInspiration}
            disabled={poems.length <= 1}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
          >
            <Shuffle className="w-4 h-4 shrink-0" />
            <span>Ambil Inspirasi Hari Ini</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={onAddPoem}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-[#121215] text-sm font-medium text-zinc-100 hover:border-[#E5A93C] hover:text-[#E5A93C] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Tulis Puisi</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Literary Spotlight Card */}
      {featuredPoem ? (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111114] p-7 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Feather className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Kutipan Pilihan Hari Ini</span>
              <span aria-hidden="true">·</span>
              <span>{featuredPoem.theme}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{featuredPoem.writtenYear}</span>
            </div>

            <button
              type="button"
              onClick={() => handleCopyQuote(featuredPoem)}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {copiedId === featuredPoem.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span className="text-[#E5A93C]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Bait</span>
                </>
              )}
            </button>
          </div>

          <blockquote className="mt-6 font-serif text-2xl sm:text-3xl lg:text-[2.15rem] italic leading-[1.4] text-[#F4F4F5] max-w-4xl">
            &ldquo;{featuredPoem.excerpt}&rdquo;
          </blockquote>

          <div className="mt-6 pt-5 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg font-semibold text-[#E5A93C]">
                {featuredPoem.title}
              </p>
              {featuredPoem.authorNote && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  {featuredPoem.authorNote}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActivePoem(featuredPoem)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-[#16161B] text-xs sm:text-sm font-medium text-zinc-100 hover:border-zinc-500 transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-[#E5A93C]" />
              <span>Baca Naskah Utuh</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111114] p-10 text-center">
          <p className="text-base font-medium text-zinc-200">
            Koleksi puisi masih kosong.
          </p>
          {isAdmin && (
            <button
              type="button"
              onClick={onAddPoem}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Puisi Pertama</span>
            </button>
          )}
        </div>
      )}

      {/* Quote Cards Archive */}
      {poems.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem, index) => {
            const isHighlighted = index === featuredIndex;
            return (
              <article
                key={poem.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-colors ${
                  isHighlighted
                    ? 'border-[#E5A93C]/60 bg-[#141418]'
                    : 'border-zinc-800/80 bg-[#111114] hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span>{poem.theme}</span>
                    <span className="tabular-nums">{poem.writtenYear}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-semibold text-white">
                    <button
                      type="button"
                      onClick={() => setActivePoem(poem)}
                      className="text-left hover:text-[#E5A93C] transition-colors"
                    >
                      {poem.title}
                    </button>
                  </h3>

                  <p className="mt-3 font-serif italic text-lg text-zinc-300 leading-relaxed">
                    &ldquo;{poem.excerpt}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/70 flex items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setActivePoem(poem)}
                    className="text-[#E5A93C] hover:text-[#F0B94E] font-medium transition-colors"
                  >
                    Baca Lengkap
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onEditPoem(poem)}
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Full Poem Reader Modal */}
      {activePoem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-poem-title"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActivePoem(null)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#111114] text-zinc-100 shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#111114]/95 backdrop-blur-md border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-[#E5A93C]">{activePoem.theme}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activePoem.writtenYear}</span>
              </div>
              <button
                type="button"
                aria-label="Tutup naskah puisi"
                onClick={() => setActivePoem(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-10">
              <h3
                id="modal-poem-title"
                className="font-serif text-3xl sm:text-4xl font-semibold text-white"
              >
                {activePoem.title}
              </h3>

              <div className="mt-7 font-serif text-xl sm:text-[1.35rem] leading-[1.85] text-zinc-200 space-y-1">
                {activePoem.stanzas.map((line, idx) =>
                  line.trim() === '' ? (
                    <div key={idx} className="h-4" aria-hidden="true" />
                  ) : (
                    <p key={idx}>{line}</p>
                  )
                )}
              </div>

              {activePoem.authorNote && (
                <p className="mt-8 pt-5 border-t border-zinc-800/70 text-xs text-zinc-400 italic">
                  Catatan penulis: {activePoem.authorNote}
                </p>
              )}

              <div className="mt-8 pt-5 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyQuote(activePoem)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-xs sm:text-sm font-medium text-zinc-200 hover:border-zinc-500 transition-colors"
                >
                  {copiedId === activePoem.id ? (
                    <>
                      <Check className="w-4 h-4 text-[#E5A93C]" />
                      <span className="text-[#E5A93C]">Kutipan Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Kutipan</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2.5">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = activePoem;
                        setActivePoem(null);
                        onEditPoem(target);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-700 text-xs sm:text-sm font-medium text-zinc-200 hover:text-white"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActivePoem(null)}
                    className="px-4 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs sm:text-sm font-semibold hover:bg-[#F0B94E]"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
