import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Download,
  Feather,
  ImagePlus,
  Layers,
  LayoutDashboard,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  UserCog,
  X,
} from 'lucide-react';
import {
  Poem,
  Project,
  ProjectCategory,
  SaaSDemoType,
  SaaSProduct,
  SiteProfile,
} from '../types';
import {
  PRESET_PROJECT_IMAGES,
  compressImageToDataUrl,
} from '../utils/imageCompress';

export type AdminTab = 'overview' | 'projects' | 'saas' | 'poems' | 'profile';

interface DataManagerModalProps {
  isOpen: boolean;
  initialTab: AdminTab;
  editingProject: Project | null;
  editingProduct: SaaSProduct | null;
  editingPoem: Poem | null;
  projects: Project[];
  saasProducts: SaaSProduct[];
  poems: Poem[];
  profile: SiteProfile;
  isBusy: boolean;
  onClose: () => void;
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onSaveProduct: (product: SaaSProduct) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onSavePoem: (poem: Poem) => Promise<void>;
  onDeletePoem: (id: string) => Promise<void>;
  onSaveProfile: (profile: SiteProfile) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}

const CATEGORIES: ProjectCategory[] = [
  'Arsitektur',
  'Konstruksi Lapangan',
  'Perencanaan RAB',
];

const DEMO_TYPES: { value: SaaSDemoType; label: string }[] = [
  { value: 'custom', label: 'Katalog Fitur Interaktif (Umum)' },
  { value: 'finance', label: 'Simulasi Sewa Ruko (Finance)' },
  { value: 'warehouse', label: 'Simulasi Stok Gudang' },
  { value: 'water', label: 'Kalkulator Tagihan Air' },
  { value: 'rab', label: 'Kalkulator Estimasi RAB' },
];

export const DataManagerModal: React.FC<DataManagerModalProps> = ({
  isOpen,
  initialTab,
  editingProject,
  editingProduct,
  editingPoem,
  projects,
  saasProducts,
  poems,
  profile,
  isBusy,
  onClose,
  onSaveProject,
  onDeleteProject,
  onSaveProduct,
  onDeleteProduct,
  onSavePoem,
  onDeletePoem,
  onSaveProfile,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const projFileInputRef = useRef<HTMLInputElement | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  // Project Form State
  const [projId, setProjId] = useState<string>('');
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] =
    useState<ProjectCategory>('Arsitektur');
  const [projYear, setProjYear] = useState('2026');
  const [projLocation, setProjLocation] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projArea, setProjArea] = useState('');
  const [projBudget, setProjBudget] = useState('');
  const [projSummary, setProjSummary] = useState('');
  const [projDeliverables, setProjDeliverables] = useState('');
  const [projImageUrl, setProjImageUrl] = useState(
    PRESET_PROJECT_IMAGES[0].url
  );
  const [projFeatured, setProjFeatured] = useState(false);
  const [showProjForm, setShowProjForm] = useState(false);

  // SaaS Form State
  const [saasId, setSaasId] = useState('');
  const [saasName, setSaasName] = useState('');
  const [saasDomain, setSaasDomain] = useState('');
  const [saasTagline, setSaasTagline] = useState('');
  const [saasDesc, setSaasDesc] = useState('');
  const [saasPrice, setSaasPrice] = useState('Rp 250.000');
  const [saasPeriod, setSaasPeriod] = useState('per bulan');
  const [saasFeatures, setSaasFeatures] = useState('');
  const [saasDemoType, setSaasDemoType] = useState<SaaSDemoType>('custom');
  const [showSaasForm, setShowSaasForm] = useState(false);

  // Poem Form State
  const [poemId, setPoemId] = useState<string>('');
  const [poemTitle, setPoemTitle] = useState('');
  const [poemExcerpt, setPoemExcerpt] = useState('');
  const [poemStanzas, setPoemStanzas] = useState('');
  const [poemTheme, setPoemTheme] = useState('Ruang & Ketekunan');
  const [poemYear, setPoemYear] = useState('2026');
  const [poemNote, setPoemNote] = useState('');
  const [showPoemForm, setShowPoemForm] = useState(false);

  // Site Profile State
  const [profileForm, setProfileForm] = useState<SiteProfile>(profile);

  const flashSaved = (msg: string) => {
    setSaveFeedback(msg);
    setTimeout(() => setSaveFeedback(null), 2600);
  };

  useEffect(() => {
    setActiveTab(initialTab);
    setConfirmReset(false);
    setConfirmDeleteId(null);
    setUploadError(null);
    setUploadStatus(null);
  }, [initialTab, isOpen]);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile, isOpen]);

  useEffect(() => {
    if (editingProject) {
      setActiveTab('projects');
      setProjId(editingProject.id);
      setProjTitle(editingProject.title);
      setProjCategory(editingProject.category);
      setProjYear(editingProject.year);
      setProjLocation(editingProject.location);
      setProjClient(editingProject.client);
      setProjArea(editingProject.area);
      setProjBudget(editingProject.budgetSummary);
      setProjSummary(editingProject.summary);
      setProjDeliverables(editingProject.deliverables.join('\n'));
      setProjImageUrl(editingProject.imageUrl);
      setProjFeatured(Boolean(editingProject.featured));
      setUploadError(null);
      setUploadStatus(null);
      setShowProjForm(true);
    } else {
      setShowProjForm(false);
    }
  }, [editingProject]);

  useEffect(() => {
    if (editingProduct) {
      setActiveTab('saas');
      setSaasId(editingProduct.id);
      setSaasName(editingProduct.name);
      setSaasDomain(editingProduct.domainLabel);
      setSaasTagline(editingProduct.tagline);
      setSaasDesc(editingProduct.description);
      setSaasPrice(editingProduct.priceLabel);
      setSaasPeriod(editingProduct.billingPeriod);
      setSaasFeatures(editingProduct.features.join('\n'));
      setSaasDemoType(editingProduct.demoType);
      setShowSaasForm(true);
    } else {
      setShowSaasForm(false);
    }
  }, [editingProduct]);

  useEffect(() => {
    if (editingPoem) {
      setActiveTab('poems');
      setPoemId(editingPoem.id);
      setPoemTitle(editingPoem.title);
      setPoemExcerpt(editingPoem.excerpt);
      setPoemStanzas(editingPoem.stanzas.join('\n'));
      setPoemTheme(editingPoem.theme);
      setPoemYear(editingPoem.writtenYear);
      setPoemNote(editingPoem.authorNote ?? '');
      setShowPoemForm(true);
    } else {
      setShowPoemForm(false);
    }
  }, [editingPoem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setShowProjForm(false);
    setShowSaasForm(false);
    setShowPoemForm(false);
    setConfirmDeleteId(null);
    setUploadError(null);
    setUploadStatus(null);
  };

  // --- Image Upload Handler ---
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'project' | 'hero'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadStatus('Memproses & mengompresi gambar...');

    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      const sizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);
      if (target === 'project') {
        setProjImageUrl(compressedDataUrl);
      } else {
        setProfileForm((prev) => ({
          ...prev,
          heroImageUrl: compressedDataUrl,
        }));
      }
      setUploadStatus(`Gambar siap disimpan (${sizeKb} KB).`);
    } catch (err) {
      setUploadStatus(null);
      setUploadError(
        err instanceof Error ? err.message : 'Gagal memproses gambar.'
      );
    } finally {
      if (target === 'project' && projFileInputRef.current) {
        projFileInputRef.current.value = '';
      }
      if (target === 'hero' && heroFileInputRef.current) {
        heroFileInputRef.current.value = '';
      }
    }
  };

  // --- Project Handlers ---
  const resetProjectForm = () => {
    setProjId('');
    setProjTitle('');
    setProjCategory('Arsitektur');
    setProjYear('2026');
    setProjLocation('');
    setProjClient('');
    setProjArea('');
    setProjBudget('');
    setProjSummary('');
    setProjDeliverables('');
    setProjImageUrl(PRESET_PROJECT_IMAGES[0].url);
    setProjFeatured(false);
    setUploadError(null);
    setUploadStatus(null);
    setActiveTab('projects');
    setShowProjForm(true);
  };

  const loadProjectForEdit = (proj: Project) => {
    setProjId(proj.id);
    setProjTitle(proj.title);
    setProjCategory(proj.category);
    setProjYear(proj.year);
    setProjLocation(proj.location);
    setProjClient(proj.client);
    setProjArea(proj.area);
    setProjBudget(proj.budgetSummary);
    setProjSummary(proj.summary);
    setProjDeliverables(proj.deliverables.join('\n'));
    setProjImageUrl(proj.imageUrl);
    setProjFeatured(Boolean(proj.featured));
    setUploadError(null);
    setUploadStatus(null);
    setShowProjForm(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projSummary.trim() || isBusy) return;

    const deliverablesList = projDeliverables
      .split('\n')
      .map((line) => line.trim().slice(0, 200))
      .filter(Boolean)
      .slice(0, 12);

    const safeId =
      projId && /^[a-zA-Z0-9_-]+$/.test(projId)
        ? projId
        : `proj-${Date.now()}`;

    await onSaveProject({
      id: safeId.slice(0, 128),
      title: projTitle.trim().slice(0, 160),
      category: projCategory,
      year: (projYear.trim() || '2026').slice(0, 20),
      location: (projLocation.trim() || 'Indonesia').slice(0, 120),
      client: (projClient.trim() || 'Klien Privat').slice(0, 120),
      area: (projArea.trim() || 'Skala Standar').slice(0, 120),
      budgetSummary: (projBudget.trim() || 'Sesuai Kesepakatan').slice(0, 120),
      summary: projSummary.trim().slice(0, 2000),
      deliverables:
        deliverablesList.length > 0
          ? deliverablesList
          : ['Desain Konsep', 'Gambar Kerja'],
      imageUrl: projImageUrl.trim().slice(0, 500000),
      featured: projFeatured,
    });
    setShowProjForm(false);
    flashSaved('Proyek berhasil disimpan ke tampilan publik.');
  };

  // --- SaaS Product Handlers ---
  const resetSaasForm = () => {
    setSaasId('');
    setSaasName('');
    setSaasDomain('');
    setSaasTagline('');
    setSaasDesc('');
    setSaasPrice('Rp 250.000');
    setSaasPeriod('per bulan');
    setSaasFeatures('');
    setSaasDemoType('custom');
    setActiveTab('saas');
    setShowSaasForm(true);
  };

  const loadSaasForEdit = (prod: SaaSProduct) => {
    setSaasId(prod.id);
    setSaasName(prod.name);
    setSaasDomain(prod.domainLabel);
    setSaasTagline(prod.tagline);
    setSaasDesc(prod.description);
    setSaasPrice(prod.priceLabel);
    setSaasPeriod(prod.billingPeriod);
    setSaasFeatures(prod.features.join('\n'));
    setSaasDemoType(prod.demoType);
    setShowSaasForm(true);
  };

  const handleSaasSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saasName.trim() || !saasDesc.trim() || isBusy) return;

    const featureList = saasFeatures
      .split('\n')
      .map((line) => line.trim().slice(0, 200))
      .filter(Boolean)
      .slice(0, 8);

    const safeId =
      saasId && /^[a-zA-Z0-9_-]+$/.test(saasId)
        ? saasId
        : `saas-${Date.now()}`;

    await onSaveProduct({
      id: safeId.slice(0, 128),
      name: saasName.trim().slice(0, 120),
      domainLabel: (saasDomain.trim() || 'Aplikasi Bisnis').slice(0, 100),
      tagline: (saasTagline.trim() || saasName.trim()).slice(0, 240),
      description: saasDesc.trim().slice(0, 1200),
      priceLabel: (saasPrice.trim() || 'Rp 250.000').slice(0, 60),
      billingPeriod: (saasPeriod.trim() || 'per bulan').slice(0, 80),
      features:
        featureList.length > 0
          ? featureList
          : ['Dasbor Operasional Lengkap', 'Laporan Otomatis'],
      demoType: saasDemoType,
    });
    setShowSaasForm(false);
    flashSaved('Produk aplikasi berhasil disimpan ke etalase publik.');
  };

  // --- Poem Handlers ---
  const resetPoemForm = () => {
    setPoemId('');
    setPoemTitle('');
    setPoemExcerpt('');
    setPoemStanzas('');
    setPoemTheme('Refleksi');
    setPoemYear('2026');
    setPoemNote('');
    setActiveTab('poems');
    setShowPoemForm(true);
  };

  const loadPoemForEdit = (poem: Poem) => {
    setPoemId(poem.id);
    setPoemTitle(poem.title);
    setPoemExcerpt(poem.excerpt);
    setPoemStanzas(poem.stanzas.join('\n'));
    setPoemTheme(poem.theme);
    setPoemYear(poem.writtenYear);
    setPoemNote(poem.authorNote ?? '');
    setShowPoemForm(true);
  };

  const handlePoemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poemTitle.trim() || !poemExcerpt.trim() || isBusy) return;

    const stanzaLines = (
      poemStanzas.trim() ? poemStanzas.split('\n') : [poemExcerpt.trim()]
    )
      .map((line) => line.slice(0, 300))
      .slice(0, 100);

    const safeId =
      poemId && /^[a-zA-Z0-9_-]+$/.test(poemId)
        ? poemId
        : `poem-${Date.now()}`;

    await onSavePoem({
      id: safeId.slice(0, 128),
      title: poemTitle.trim().slice(0, 160),
      excerpt: poemExcerpt.trim().slice(0, 500),
      stanzas: stanzaLines,
      theme: (poemTheme.trim() || 'Sastra').slice(0, 80),
      writtenYear: (poemYear.trim() || '2026').slice(0, 20),
      authorNote: poemNote.trim() ? poemNote.trim().slice(0, 300) : undefined,
    });
    setShowPoemForm(false);
    flashSaved('Naskah puisi berhasil disimpan.');
  };

  // --- Profile Handler ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    await onSaveProfile({
      heroKicker: profileForm.heroKicker.trim().slice(0, 120),
      heroTitle: profileForm.heroTitle.trim().slice(0, 160),
      heroSubtitle: profileForm.heroSubtitle.trim().slice(0, 1000),
      heroImageUrl: profileForm.heroImageUrl.trim().slice(0, 500000),
      heroImageCaption: profileForm.heroImageCaption.trim().slice(0, 120),
      heroImageLocation: profileForm.heroImageLocation.trim().slice(0, 120),
      aboutHeading: profileForm.aboutHeading.trim().slice(0, 160),
      aboutBio: profileForm.aboutBio.trim().slice(0, 1500),
      contactEmail: profileForm.contactEmail.trim().slice(0, 160),
      pillar1Title: profileForm.pillar1Title.trim().slice(0, 80),
      pillar1Desc: profileForm.pillar1Desc.trim().slice(0, 400),
      pillar2Title: profileForm.pillar2Title.trim().slice(0, 80),
      pillar2Desc: profileForm.pillar2Desc.trim().slice(0, 400),
      pillar3Title: profileForm.pillar3Title.trim().slice(0, 80),
      pillar3Desc: profileForm.pillar3Desc.trim().slice(0, 400),
    });
    flashSaved('Profil, Hero & Tentang Saya berhasil diperbarui.');
  };

  const handleExportBackup = () => {
    const payload = {
      brand: 'NARATHA',
      exportedAt: new Date().toISOString(),
      profile,
      projects,
      saasProducts,
      poems,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'naratha-cms-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const TABS: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'projects', label: `Proyek (${projects.length})`, icon: Building2 },
    { id: 'saas', label: `Aplikasi (${saasProducts.length})`, icon: Layers },
    { id: 'poems', label: `Puisi (${poems.length})`, icon: Feather },
    { id: 'profile', label: 'Profil & Hero', icon: UserCog },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-manager-title"
    >
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#111114] text-zinc-100 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 bg-[#111114]/95 backdrop-blur-md border-b border-zinc-800/80">
          <div>
            <p className="text-xs text-[#E5A93C] font-medium">
              Dashboard Admin · NARATHA CMS
            </p>
            <h3 id="data-manager-title" className="text-lg font-bold text-white">
              Kelola Konten Publik Portofolio
            </h3>
          </div>

          <button
            type="button"
            aria-label="Tutup dashboard admin"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-zinc-800/70 flex flex-wrap items-center gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E5A93C] text-[#09090B]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save Feedback Banner */}
        {saveFeedback && (
          <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl border border-emerald-700/60 bg-emerald-950/40 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#151519]">
                  <p className="text-xs text-zinc-400">Proyek Portfolio</p>
                  <p className="mt-1.5 text-2xl font-bold text-white tabular-nums">
                    {projects.length}
                  </p>
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="mt-3 text-xs font-medium text-[#E5A93C] hover:underline"
                  >
                    + Tambah Proyek Baru
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#151519]">
                  <p className="text-xs text-zinc-400">Aplikasi &amp; SaaS</p>
                  <p className="mt-1.5 text-2xl font-bold text-white tabular-nums">
                    {saasProducts.length}
                  </p>
                  <button
                    type="button"
                    onClick={resetSaasForm}
                    className="mt-3 text-xs font-medium text-[#E5A93C] hover:underline"
                  >
                    + Tambah Aplikasi Baru
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#151519]">
                  <p className="text-xs text-zinc-400">Koleksi Ruang Puisi</p>
                  <p className="mt-1.5 text-2xl font-bold text-white tabular-nums">
                    {poems.length}
                  </p>
                  <button
                    type="button"
                    onClick={resetPoemForm}
                    className="mt-3 text-xs font-medium text-[#E5A93C] hover:underline"
                  >
                    + Tulis Puisi Baru
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#151519] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Identitas Halaman Utama &amp; Tentang Saya
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Ubah judul Hero, foto sampul, narasi profil, email kontak,
                    atau 3 pilar keahlian Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => switchTab('profile')}
                  className="px-4 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs font-semibold hover:bg-[#F0B94E] whitespace-nowrap shrink-0"
                >
                  Edit Profil &amp; Hero
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-zinc-500">
                  Cadangkan seluruh data ke file JSON atau pulihkan data awal.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-700 text-xs font-medium text-zinc-200 hover:border-zinc-500"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Cadangan JSON</span>
                  </button>

                  {!confirmReset ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setConfirmReset(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-700 text-xs font-medium text-zinc-300 hover:text-amber-300 hover:border-amber-700/60"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulihkan Data Awal</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={async () => {
                        await onResetDefaults();
                        setConfirmReset(false);
                        flashSaved('Data awal berhasil dipulihkan.');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      <span>{isBusy ? 'Memulihkan...' : 'Ya, Pulihkan'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' &&
            (showProjForm ? (
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h4 className="text-base font-semibold text-white">
                    {projId ? 'Edit Proyek & Gambar' : 'Tambah Proyek Baru'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowProjForm(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Kembali ke Daftar
                  </button>
                </div>

                {/* Image Upload & Preview Block */}
                <div className="rounded-xl border border-zinc-800 bg-[#16161B] p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-medium text-zinc-300">
                      Foto / Gambar Proyek
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        ref={projFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleImageUpload(e, 'project')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => projFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs font-semibold hover:bg-[#F0B94E] transition-colors"
                      >
                        <ImagePlus className="w-3.5 h-3.5" />
                        <span>Upload Foto dari Perangkat</span>
                      </button>
                    </div>
                  </div>

                  {projImageUrl && (
                    <div className="aspect-[16/9] max-h-48 w-full rounded-lg overflow-hidden border border-zinc-800 bg-[#0E0E11]">
                      <img
                        src={projImageUrl}
                        alt="Pratinjau gambar proyek"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {uploadStatus && (
                    <p className="text-xs text-[#E5A93C]">{uploadStatus}</p>
                  )}
                  {uploadError && (
                    <p className="text-xs text-red-400">{uploadError}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs text-zinc-500 mr-1">
                      Atau pilih bawaan:
                    </span>
                    {PRESET_PROJECT_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setProjImageUrl(preset.url);
                          setUploadStatus(null);
                          setUploadError(null);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                          projImageUrl === preset.url
                            ? 'border-[#E5A93C] text-[#E5A93C] bg-[#1D1A12]'
                            : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <label className="block pt-1">
                    <span className="text-xs text-zinc-500">
                      Atau tempel tautan URL gambar (opsional)
                    </span>
                    <input
                      type="text"
                      value={projImageUrl}
                      onChange={(e) => setProjImageUrl(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-[#111114] border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">Nama Proyek *</span>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="Contoh: Klaster Rumah Tropis Cigadung"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">Kategori</span>
                    <select
                      value={projCategory}
                      onChange={(e) =>
                        setProjCategory(e.target.value as ProjectCategory)
                      }
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">Tahun</span>
                    <input
                      type="text"
                      maxLength={20}
                      value={projYear}
                      onChange={(e) => setProjYear(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">Lokasi</span>
                    <input
                      type="text"
                      maxLength={120}
                      value={projLocation}
                      onChange={(e) => setProjLocation(e.target.value)}
                      placeholder="Bandung / Sumedang"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">Klien / Mitra</span>
                    <input
                      type="text"
                      maxLength={120}
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      placeholder="Nama klien atau perusahaan"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">Luas / Skala</span>
                    <input
                      type="text"
                      maxLength={120}
                      value={projArea}
                      onChange={(e) => setProjArea(e.target.value)}
                      placeholder="Contoh: 450 m²"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">
                      Nilai Proyek / Lingkup
                    </span>
                    <input
                      type="text"
                      maxLength={120}
                      value={projBudget}
                      onChange={(e) => setProjBudget(e.target.value)}
                      placeholder="Contoh: Rp 1,8 Miliar"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Ringkasan Pekerjaan *
                    </span>
                    <textarea
                      required
                      maxLength={2000}
                      rows={3}
                      value={projSummary}
                      onChange={(e) => setProjSummary(e.target.value)}
                      placeholder="Jelaskan konsep desain, metode konstruksi, atau detail RAB..."
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Deliverables (satu item per baris)
                    </span>
                    <textarea
                      rows={2}
                      value={projDeliverables}
                      onChange={(e) => setProjDeliverables(e.target.value)}
                      placeholder={'Siteplan Kawasan\nGambar Kerja DED\nRAB Lengkap'}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="sm:col-span-2 flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projFeatured}
                      onChange={(e) => setProjFeatured(e.target.checked)}
                      className="rounded border-zinc-700 bg-[#16161B] accent-[#E5A93C]"
                    />
                    <span>Tampilkan sebagai proyek unggulan (kartu lebar)</span>
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProjForm(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="px-5 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] disabled:opacity-50"
                  >
                    {isBusy ? 'Menyimpan...' : 'Simpan Proyek'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-zinc-400">
                    Tambah, edit keterangan, ganti gambar, atau hapus proyek.
                  </p>
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs font-semibold hover:bg-[#F0B94E] shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Proyek</span>
                  </button>
                </div>

                <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-[#141418]">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {proj.imageUrl && (
                          <img
                            src={proj.imageUrl}
                            alt=""
                            className="w-12 h-10 rounded-md object-cover border border-zinc-800 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {proj.title}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5 truncate">
                            {proj.category} · {proj.year} · {proj.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          aria-label={`Edit ${proj.title}`}
                          onClick={() => loadProjectForEdit(proj)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {confirmDeleteId === proj.id ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={async () => {
                              await onDeleteProject(proj.id);
                              setConfirmDeleteId(null);
                              flashSaved('Proyek berhasil dihapus.');
                            }}
                            className="px-3 h-9 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-500"
                          >
                            Hapus?
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Hapus ${proj.title}`}
                            onClick={() => setConfirmDeleteId(proj.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-700/60"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* TAB 3: SAAS PRODUCTS */}
          {activeTab === 'saas' &&
            (showSaasForm ? (
              <form onSubmit={handleSaasSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h4 className="text-base font-semibold text-white">
                    {saasId ? 'Edit Aplikasi & SaaS' : 'Tambah Aplikasi Baru'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowSaasForm(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Kembali ke Daftar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs text-zinc-400">
                      Nama Produk / Aplikasi *
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={saasName}
                      onChange={(e) => setSaasName(e.target.value)}
                      placeholder="Contoh: NARATHA FINANCE"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">
                      Kategori / Bidang
                    </span>
                    <input
                      type="text"
                      maxLength={100}
                      value={saasDomain}
                      onChange={(e) => setSaasDomain(e.target.value)}
                      placeholder="Contoh: Manajemen Sewa & Properti"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Tagline Singkat
                    </span>
                    <input
                      type="text"
                      maxLength={240}
                      value={saasTagline}
                      onChange={(e) => setSaasTagline(e.target.value)}
                      placeholder="Satu kalimat ringkas keunggulan aplikasi..."
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">Harga Paket</span>
                    <input
                      type="text"
                      maxLength={60}
                      value={saasPrice}
                      onChange={(e) => setSaasPrice(e.target.value)}
                      placeholder="Rp 250.000"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">
                      Keterangan Periode
                    </span>
                    <input
                      type="text"
                      maxLength={80}
                      value={saasPeriod}
                      onChange={(e) => setSaasPeriod(e.target.value)}
                      placeholder="per bulan · hingga 50 unit"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Mode Simulasi Demo
                    </span>
                    <select
                      value={saasDemoType}
                      onChange={(e) =>
                        setSaasDemoType(e.target.value as SaaSDemoType)
                      }
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    >
                      {DEMO_TYPES.map((dt) => (
                        <option key={dt.value} value={dt.value}>
                          {dt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Deskripsi Produk *
                    </span>
                    <textarea
                      required
                      maxLength={1200}
                      rows={3}
                      value={saasDesc}
                      onChange={(e) => setSaasDesc(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Daftar Fitur (satu fitur per baris)
                    </span>
                    <textarea
                      rows={3}
                      value={saasFeatures}
                      onChange={(e) => setSaasFeatures(e.target.value)}
                      placeholder={'Buku besar penyewa\nRekap arus kas bulanan'}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSaasForm(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="px-5 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] disabled:opacity-50"
                  >
                    {isBusy ? 'Menyimpan...' : 'Simpan Aplikasi'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-zinc-400">
                    Kelola daftar produk SaaS, harga langganan, dan fitur di
                    etalase.
                  </p>
                  <button
                    type="button"
                    onClick={resetSaasForm}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs font-semibold hover:bg-[#F0B94E] shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Aplikasi</span>
                  </button>
                </div>

                <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-[#141418]">
                  {saasProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {prod.name}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 truncate">
                          {prod.domainLabel} · {prod.priceLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          aria-label={`Edit ${prod.name}`}
                          onClick={() => loadSaasForEdit(prod)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {confirmDeleteId === prod.id ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={async () => {
                              await onDeleteProduct(prod.id);
                              setConfirmDeleteId(null);
                              flashSaved('Aplikasi berhasil dihapus.');
                            }}
                            className="px-3 h-9 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-500"
                          >
                            Hapus?
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Hapus ${prod.name}`}
                            onClick={() => setConfirmDeleteId(prod.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-700/60"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* TAB 4: POEMS */}
          {activeTab === 'poems' &&
            (showPoemForm ? (
              <form onSubmit={handlePoemSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h4 className="text-base font-semibold text-white">
                    {poemId ? 'Edit Puisi' : 'Tulis Puisi Baru'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowPoemForm(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Kembali ke Daftar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">Judul Puisi *</span>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      value={poemTitle}
                      onChange={(e) => setPoemTitle(e.target.value)}
                      placeholder="Contoh: Lampu Proyek Pukul Sepuluh"
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">Tema</span>
                    <input
                      type="text"
                      maxLength={80}
                      value={poemTheme}
                      onChange={(e) => setPoemTheme(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-400">
                      Tahun Penulisan
                    </span>
                    <input
                      type="text"
                      maxLength={20}
                      value={poemYear}
                      onChange={(e) => setPoemYear(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Kutipan Utama (Ditampilkan di Kartu) *
                    </span>
                    <textarea
                      required
                      maxLength={500}
                      rows={2}
                      value={poemExcerpt}
                      onChange={(e) => setPoemExcerpt(e.target.value)}
                      placeholder="Satu atau dua larik paling berkesan dari puisi ini..."
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Naskah Puisi Lengkap (pisahkan bait dengan baris kosong)
                    </span>
                    <textarea
                      rows={6}
                      value={poemStanzas}
                      onChange={(e) => setPoemStanzas(e.target.value)}
                      placeholder="Tulis bait-bait puisi Anda di sini..."
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-serif text-base text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs text-zinc-400">
                      Catatan Penulis (opsional)
                    </span>
                    <input
                      type="text"
                      maxLength={300}
                      value={poemNote}
                      onChange={(e) => setPoemNote(e.target.value)}
                      placeholder="Tempat atau suasana saat menulis..."
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPoemForm(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="px-5 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] disabled:opacity-50"
                  >
                    {isBusy ? 'Menyimpan...' : 'Simpan Puisi'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-zinc-400">
                    Tambah, edit, atau hapus karya puisi di Ruang Sastra.
                  </p>
                  <button
                    type="button"
                    onClick={resetPoemForm}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs font-semibold hover:bg-[#F0B94E] shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tulis Puisi</span>
                  </button>
                </div>

                <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-[#141418]">
                  {poems.map((poem) => (
                    <div
                      key={poem.id}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-serif text-base font-semibold text-white truncate">
                          {poem.title}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 truncate">
                          {poem.theme} · {poem.writtenYear} · &ldquo;
                          {poem.excerpt}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          aria-label={`Edit ${poem.title}`}
                          onClick={() => loadPoemForEdit(poem)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {confirmDeleteId === poem.id ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={async () => {
                              await onDeletePoem(poem.id);
                              setConfirmDeleteId(null);
                              flashSaved('Puisi berhasil dihapus.');
                            }}
                            className="px-3 h-9 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-500"
                          >
                            Hapus?
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Hapus ${poem.title}`}
                            onClick={() => setConfirmDeleteId(poem.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-700/60"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* TAB 5: PROFILE & HERO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Hero Photo Upload */}
              <div className="rounded-xl border border-zinc-800 bg-[#16161B] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-medium text-zinc-300">
                    Foto Sampul Halaman Utama (Hero)
                  </span>
                  <div>
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => void handleImageUpload(e, 'hero')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs font-semibold hover:bg-[#F0B94E]"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>Upload Foto Hero Baru</span>
                    </button>
                  </div>
                </div>

                {profileForm.heroImageUrl && (
                  <div className="aspect-[16/9] max-h-44 w-full rounded-lg overflow-hidden border border-zinc-800 bg-[#0E0E11]">
                    <img
                      src={profileForm.heroImageUrl}
                      alt="Pratinjau foto Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {uploadStatus && (
                  <p className="text-xs text-[#E5A93C]">{uploadStatus}</p>
                )}
                {uploadError && (
                  <p className="text-xs text-red-400">{uploadError}</p>
                )}

                <label className="block">
                  <span className="text-xs text-zinc-500">
                    Tautan URL Gambar Hero
                  </span>
                  <input
                    type="text"
                    value={profileForm.heroImageUrl}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        heroImageUrl: e.target.value,
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-[#111114] border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <span className="text-xs text-zinc-400">
                    Label Keahlian Atas (Hero Kicker)
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={profileForm.heroKicker}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        heroKicker: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs text-zinc-400">
                    Judul Utama Hero
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={profileForm.heroTitle}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        heroTitle: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs text-zinc-400">
                    Sub-Judul Penjelas Hero
                  </span>
                  <textarea
                    required
                    rows={3}
                    maxLength={1000}
                    value={profileForm.heroSubtitle}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        heroSubtitle: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-zinc-400">
                    Keterangan Foto Hero
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={profileForm.heroImageCaption}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        heroImageCaption: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-zinc-400">Lokasi Studio</span>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={profileForm.heroImageLocation}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        heroImageLocation: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-zinc-400">
                    Judul Seksi Tentang Saya
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={profileForm.aboutHeading}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        aboutHeading: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-zinc-400">Email Kontak</span>
                  <input
                    type="email"
                    required
                    maxLength={160}
                    value={profileForm.contactEmail}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs text-zinc-400">
                    Biografi Tentang Saya
                  </span>
                  <textarea
                    required
                    rows={3}
                    maxLength={1500}
                    value={profileForm.aboutBio}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        aboutBio: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </label>
              </div>

              {/* 3 Pillars */}
              <div className="pt-3 border-t border-zinc-800 space-y-4">
                <p className="text-xs font-medium text-zinc-300">
                  3 Pilar Keahlian (Tentang Saya)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={profileForm.pillar1Title}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          pillar1Title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#16161B] border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                    <textarea
                      required
                      rows={3}
                      maxLength={400}
                      value={profileForm.pillar1Desc}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          pillar1Desc: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#16161B] border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={profileForm.pillar2Title}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          pillar2Title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#16161B] border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                    <textarea
                      required
                      rows={3}
                      maxLength={400}
                      value={profileForm.pillar2Desc}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          pillar2Desc: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#16161B] border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={profileForm.pillar3Title}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          pillar3Title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#16161B] border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                    <textarea
                      required
                      rows={3}
                      maxLength={400}
                      value={profileForm.pillar3Desc}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          pillar3Desc: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#16161B] border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="px-5 py-2.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] disabled:opacity-50"
                >
                  {isBusy ? 'Menyimpan...' : 'Simpan Profil & Hero'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
