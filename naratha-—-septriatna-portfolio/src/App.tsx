import { useCallback, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { AboutSection } from './components/AboutSection';
import { AdminTab, DataManagerModal } from './components/DataManagerModal';
import { HeroSection } from './components/HeroSection';
import { PoetrySection } from './components/PoetrySection';
import { PortfolioSection } from './components/PortfolioSection';
import { SaaSDemoModal } from './components/SaaSDemoModal';
import { SaaSSection } from './components/SaaSSection';
import { SideDockNav } from './components/SideDockNav';
import {
  DEFAULT_POEMS,
  DEFAULT_PROJECTS,
  DEFAULT_SAAS_PRODUCTS,
  DEFAULT_SITE_PROFILE,
} from './data/defaults';
import {
  ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
} from './firebase';
import { Poem, Project, SaaSProduct, SectionId, SiteProfile } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const [cloudProjects, setCloudProjects] = useState<Project[] | null>(null);
  const [cloudProducts, setCloudProducts] = useState<SaaSProduct[] | null>(
    null
  );
  const [cloudPoems, setCloudPoems] = useState<Poem[] | null>(null);
  const [cloudProfile, setCloudProfile] = useState<SiteProfile | null>(null);
  const [isInitializedInCloud, setIsInitializedInCloud] = useState<
    boolean | null
  >(null);
  const [isMutating, setIsMutating] = useState(false);

  const [activeSection, setActiveSection] = useState<SectionId>('beranda');

  // SaaS Demo / Subscription Modal State
  const [activeProduct, setActiveProduct] = useState<SaaSProduct | null>(null);
  const [productModalMode, setProductModalMode] = useState<
    'demo' | 'subscribe'
  >('demo');

  // Admin Dashboard Modal State
  const [dataManagerOpen, setDataManagerOpen] = useState(false);
  const [dataManagerTab, setDataManagerTab] = useState<AdminTab>('overview');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingProduct, setEditingProduct] = useState<SaaSProduct | null>(
    null
  );
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);

  // Resolve displayed data: live Firestore when initialized, else starter defaults
  const projects =
    isInitializedInCloud && cloudProjects !== null
      ? cloudProjects
      : DEFAULT_PROJECTS;

  const saasProducts =
    isInitializedInCloud && cloudProducts !== null && cloudProducts.length > 0
      ? cloudProducts
      : isInitializedInCloud && cloudProducts !== null
        ? cloudProducts
        : DEFAULT_SAAS_PRODUCTS;

  const poems =
    isInitializedInCloud && cloudPoems !== null ? cloudPoems : DEFAULT_POEMS;

  const profile = cloudProfile ?? DEFAULT_SITE_PROFILE;

  // Listen to Firebase Auth state & verify admin role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthNotice(null);

      if (!currentUser) {
        setIsAdmin(false);
        setDataManagerOpen(false);
        return;
      }

      if (!currentUser.emailVerified) {
        setIsAdmin(false);
        setAuthNotice(
          'Email akun Anda belum terverifikasi untuk akses Admin NARATHA.'
        );
        return;
      }

      if (currentUser.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setAuthNotice(
            `Akun ${currentUser.email ?? ''} bukan admin terdaftar. Halaman tetap dalam mode publik.`
          );
        }
      } catch {
        setIsAdmin(false);
        setAuthNotice(
          `Akun ${currentUser.email ?? ''} tidak memiliki izin admin.`
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to site initialization status & site profile
  useEffect(() => {
    const unsubInit = onSnapshot(
      doc(db, 'settings', 'init'),
      (snap) => {
        setIsInitializedInCloud(
          snap.exists() && Boolean(snap.data()?.initialized)
        );
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'settings/init');
      }
    );

    const unsubProfile = onSnapshot(
      doc(db, 'siteProfile', 'main'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setCloudProfile({
            heroKicker: String(data.heroKicker ?? DEFAULT_SITE_PROFILE.heroKicker),
            heroTitle: String(data.heroTitle ?? DEFAULT_SITE_PROFILE.heroTitle),
            heroSubtitle: String(
              data.heroSubtitle ?? DEFAULT_SITE_PROFILE.heroSubtitle
            ),
            heroImageUrl: String(
              data.heroImageUrl ?? DEFAULT_SITE_PROFILE.heroImageUrl
            ),
            heroImageCaption: String(
              data.heroImageCaption ?? DEFAULT_SITE_PROFILE.heroImageCaption
            ),
            heroImageLocation: String(
              data.heroImageLocation ?? DEFAULT_SITE_PROFILE.heroImageLocation
            ),
            aboutHeading: String(
              data.aboutHeading ?? DEFAULT_SITE_PROFILE.aboutHeading
            ),
            aboutBio: String(data.aboutBio ?? DEFAULT_SITE_PROFILE.aboutBio),
            contactEmail: String(
              data.contactEmail ?? DEFAULT_SITE_PROFILE.contactEmail
            ),
            pillar1Title: String(
              data.pillar1Title ?? DEFAULT_SITE_PROFILE.pillar1Title
            ),
            pillar1Desc: String(
              data.pillar1Desc ?? DEFAULT_SITE_PROFILE.pillar1Desc
            ),
            pillar2Title: String(
              data.pillar2Title ?? DEFAULT_SITE_PROFILE.pillar2Title
            ),
            pillar2Desc: String(
              data.pillar2Desc ?? DEFAULT_SITE_PROFILE.pillar2Desc
            ),
            pillar3Title: String(
              data.pillar3Title ?? DEFAULT_SITE_PROFILE.pillar3Title
            ),
            pillar3Desc: String(
              data.pillar3Desc ?? DEFAULT_SITE_PROFILE.pillar3Desc
            ),
            ownerUid: String(data.ownerUid ?? ''),
          });
        } else {
          setCloudProfile(null);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'siteProfile/main');
      }
    );

    return () => {
      unsubInit();
      unsubProfile();
    };
  }, []);

  // Real-time public read listeners for projects, saasProducts & poems
  useEffect(() => {
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'asc')
    );
    const unsubProjects = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const items: Project[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: String(data.id ?? d.id),
            title: String(data.title ?? ''),
            category: data.category,
            year: String(data.year ?? ''),
            location: String(data.location ?? ''),
            client: String(data.client ?? ''),
            area: String(data.area ?? ''),
            budgetSummary: String(data.budgetSummary ?? ''),
            summary: String(data.summary ?? ''),
            deliverables: Array.isArray(data.deliverables)
              ? data.deliverables.map(String)
              : [],
            imageUrl: String(data.imageUrl ?? ''),
            featured: Boolean(data.featured),
            ownerUid: String(data.ownerUid ?? ''),
          };
        });
        setCloudProjects(items);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'projects');
      }
    );

    const saasQuery = query(
      collection(db, 'saasProducts'),
      orderBy('createdAt', 'asc')
    );
    const unsubSaas = onSnapshot(
      saasQuery,
      (snapshot) => {
        const items: SaaSProduct[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: String(data.id ?? d.id),
            name: String(data.name ?? ''),
            domainLabel: String(data.domainLabel ?? ''),
            tagline: String(data.tagline ?? ''),
            description: String(data.description ?? ''),
            priceLabel: String(data.priceLabel ?? ''),
            billingPeriod: String(data.billingPeriod ?? ''),
            features: Array.isArray(data.features)
              ? data.features.map(String)
              : [],
            demoType: data.demoType ?? 'custom',
            ownerUid: String(data.ownerUid ?? ''),
          };
        });
        setCloudProducts(items);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'saasProducts');
      }
    );

    const poemsQuery = query(
      collection(db, 'poems'),
      orderBy('createdAt', 'asc')
    );
    const unsubPoems = onSnapshot(
      poemsQuery,
      (snapshot) => {
        const items: Poem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: String(data.id ?? d.id),
            title: String(data.title ?? ''),
            excerpt: String(data.excerpt ?? ''),
            stanzas: Array.isArray(data.stanzas)
              ? data.stanzas.map(String)
              : [],
            theme: String(data.theme ?? ''),
            writtenYear: String(data.writtenYear ?? ''),
            authorNote: data.authorNote ? String(data.authorNote) : undefined,
            ownerUid: String(data.ownerUid ?? ''),
          };
        });
        setCloudPoems(items);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'poems');
      }
    );

    return () => {
      unsubProjects();
      unsubSaas();
      unsubPoems();
    };
  }, []);

  // Seed default starter data to Firestore when Admin first logs in or resets
  const seedInitialDataToFirestore = useCallback(async (uid: string) => {
    setIsMutating(true);
    try {
      for (const proj of DEFAULT_PROJECTS) {
        await setDoc(doc(db, 'projects', proj.id), {
          id: proj.id,
          title: proj.title.slice(0, 160),
          category: proj.category,
          year: proj.year.slice(0, 20),
          location: proj.location.slice(0, 120),
          client: proj.client.slice(0, 120),
          area: proj.area.slice(0, 120),
          budgetSummary: proj.budgetSummary.slice(0, 120),
          summary: proj.summary.slice(0, 2000),
          deliverables: proj.deliverables.slice(0, 12),
          imageUrl: proj.imageUrl.slice(0, 500000),
          featured: Boolean(proj.featured),
          ownerUid: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      for (const prod of DEFAULT_SAAS_PRODUCTS) {
        await setDoc(doc(db, 'saasProducts', prod.id), {
          id: prod.id,
          name: prod.name.slice(0, 120),
          domainLabel: prod.domainLabel.slice(0, 100),
          tagline: prod.tagline.slice(0, 240),
          description: prod.description.slice(0, 1200),
          priceLabel: prod.priceLabel.slice(0, 60),
          billingPeriod: prod.billingPeriod.slice(0, 80),
          features: prod.features.slice(0, 8),
          demoType: prod.demoType,
          ownerUid: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      for (const poem of DEFAULT_POEMS) {
        const payload: Record<string, unknown> = {
          id: poem.id,
          title: poem.title.slice(0, 160),
          excerpt: poem.excerpt.slice(0, 500),
          stanzas: poem.stanzas.slice(0, 100),
          theme: poem.theme.slice(0, 80),
          writtenYear: poem.writtenYear.slice(0, 20),
          ownerUid: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        if (poem.authorNote) {
          payload.authorNote = poem.authorNote.slice(0, 300);
        }
        await setDoc(doc(db, 'poems', poem.id), payload);
      }

      await setDoc(doc(db, 'siteProfile', 'main'), {
        ...DEFAULT_SITE_PROFILE,
        ownerUid: uid,
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'settings', 'init'), {
        initialized: true,
        ownerUid: uid,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/init');
    } finally {
      setIsMutating(false);
    }
  }, []);

  // Also backfill saasProducts if upgrading from an earlier initialized database
  const ensureSaasSeeded = useCallback(async (uid: string) => {
    try {
      for (const prod of DEFAULT_SAAS_PRODUCTS) {
        await setDoc(doc(db, 'saasProducts', prod.id), {
          id: prod.id,
          name: prod.name.slice(0, 120),
          domainLabel: prod.domainLabel.slice(0, 100),
          tagline: prod.tagline.slice(0, 240),
          description: prod.description.slice(0, 1200),
          priceLabel: prod.priceLabel.slice(0, 60),
          billingPeriod: prod.billingPeriod.slice(0, 80),
          features: prod.features.slice(0, 8),
          demoType: prod.demoType,
          ownerUid: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'saasProducts');
    }
  }, []);

  useEffect(() => {
    if (!isAdmin || !user) return;
    if (isInitializedInCloud === false) {
      void seedInitialDataToFirestore(user.uid);
    } else if (
      isInitializedInCloud === true &&
      cloudProducts !== null &&
      cloudProducts.length === 0
    ) {
      void ensureSaasSeeded(user.uid);
    }
  }, [
    isAdmin,
    user,
    isInitializedInCloud,
    cloudProducts,
    seedInitialDataToFirestore,
    ensureSaasSeeded,
  ]);

  // Track visible section in viewport for side navigation highlight
  useEffect(() => {
    const sectionIds: SectionId[] = [
      'beranda',
      'portfolio',
      'aplikasi',
      'puisi',
      'tentang',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.01 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAdminLogin = async () => {
    setAuthNotice(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setAuthNotice('Proses masuk dibatalkan atau gagal. Silakan coba lagi.');
    }
  };

  const handleAdminLogout = async () => {
    setDataManagerOpen(false);
    await signOut(auth);
  };

  const handleOpenProductModal = (
    product: SaaSProduct,
    mode: 'demo' | 'subscribe'
  ) => {
    setActiveProduct(product);
    setProductModalMode(mode);
  };

  const openDashboard = (tab: AdminTab) => {
    if (!isAdmin) return;
    setEditingProject(null);
    setEditingProduct(null);
    setEditingPoem(null);
    setDataManagerTab(tab);
    setDataManagerOpen(true);
  };

  const handleSaveProject = async (saved: Project) => {
    if (!isAdmin || !user) return;
    setIsMutating(true);
    const docPath = `projects/${saved.id}`;
    try {
      const existsInCloud = (cloudProjects ?? []).some(
        (p) => p.id === saved.id
      );

      if (existsInCloud) {
        await updateDoc(doc(db, 'projects', saved.id), {
          title: saved.title.slice(0, 160),
          category: saved.category,
          year: saved.year.slice(0, 20),
          location: saved.location.slice(0, 120),
          client: saved.client.slice(0, 120),
          area: saved.area.slice(0, 120),
          budgetSummary: saved.budgetSummary.slice(0, 120),
          summary: saved.summary.slice(0, 2000),
          deliverables: saved.deliverables.slice(0, 12),
          imageUrl: saved.imageUrl.slice(0, 500000),
          featured: Boolean(saved.featured),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'projects', saved.id), {
          id: saved.id,
          title: saved.title.slice(0, 160),
          category: saved.category,
          year: saved.year.slice(0, 20),
          location: saved.location.slice(0, 120),
          client: saved.client.slice(0, 120),
          area: saved.area.slice(0, 120),
          budgetSummary: saved.budgetSummary.slice(0, 120),
          summary: saved.summary.slice(0, 2000),
          deliverables: saved.deliverables.slice(0, 12),
          imageUrl: saved.imageUrl.slice(0, 500000),
          featured: Boolean(saved.featured),
          ownerUid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setEditingProject(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!isAdmin) return;
    setIsMutating(true);
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveProduct = async (saved: SaaSProduct) => {
    if (!isAdmin || !user) return;
    setIsMutating(true);
    const docPath = `saasProducts/${saved.id}`;
    try {
      const existsInCloud = (cloudProducts ?? []).some(
        (p) => p.id === saved.id
      );

      if (existsInCloud) {
        await updateDoc(doc(db, 'saasProducts', saved.id), {
          name: saved.name.slice(0, 120),
          domainLabel: saved.domainLabel.slice(0, 100),
          tagline: saved.tagline.slice(0, 240),
          description: saved.description.slice(0, 1200),
          priceLabel: saved.priceLabel.slice(0, 60),
          billingPeriod: saved.billingPeriod.slice(0, 80),
          features: saved.features.slice(0, 8),
          demoType: saved.demoType,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'saasProducts', saved.id), {
          id: saved.id,
          name: saved.name.slice(0, 120),
          domainLabel: saved.domainLabel.slice(0, 100),
          tagline: saved.tagline.slice(0, 240),
          description: saved.description.slice(0, 1200),
          priceLabel: saved.priceLabel.slice(0, 60),
          billingPeriod: saved.billingPeriod.slice(0, 80),
          features: saved.features.slice(0, 8),
          demoType: saved.demoType,
          ownerUid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setEditingProduct(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!isAdmin) return;
    setIsMutating(true);
    try {
      await deleteDoc(doc(db, 'saasProducts', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `saasProducts/${id}`);
    } finally {
      setIsMutating(false);
    }
  };

  const handleSavePoem = async (saved: Poem) => {
    if (!isAdmin || !user) return;
    setIsMutating(true);
    const docPath = `poems/${saved.id}`;
    try {
      const existsInCloud = (cloudPoems ?? []).some((p) => p.id === saved.id);

      const updateFields: Record<string, unknown> = {
        title: saved.title.slice(0, 160),
        excerpt: saved.excerpt.slice(0, 500),
        stanzas: saved.stanzas.slice(0, 100),
        theme: saved.theme.slice(0, 80),
        writtenYear: saved.writtenYear.slice(0, 20),
        authorNote: (saved.authorNote ?? '').slice(0, 300),
        updatedAt: serverTimestamp(),
      };

      if (existsInCloud) {
        await updateDoc(doc(db, 'poems', saved.id), updateFields);
      } else {
        await setDoc(doc(db, 'poems', saved.id), {
          id: saved.id,
          ...updateFields,
          ownerUid: user.uid,
          createdAt: serverTimestamp(),
        });
      }
      setEditingPoem(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeletePoem = async (id: string) => {
    if (!isAdmin) return;
    setIsMutating(true);
    try {
      await deleteDoc(doc(db, 'poems', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `poems/${id}`);
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveProfile = async (saved: SiteProfile) => {
    if (!isAdmin || !user) return;
    setIsMutating(true);
    try {
      await setDoc(doc(db, 'siteProfile', 'main'), {
        ...saved,
        ownerUid: user.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteProfile/main');
    } finally {
      setIsMutating(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!isAdmin || !user) return;
    await seedInitialDataToFirestore(user.uid);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5]">
      <SideDockNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenDataManager={() => openDashboard('overview')}
        onSignOut={() => void handleAdminLogout()}
        isAdmin={isAdmin}
        projectCount={projects.length}
        poemCount={poems.length}
      />

      {/* Main Content Area offset for desktop floating dock and mobile top bar */}
      <main className="pt-14 lg:pt-0 lg:pl-72">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
          <HeroSection
            profile={profile}
            isAdmin={isAdmin}
            onEditProfile={() => openDashboard('profile')}
            onNavigate={handleNavigate}
            projectCount={projects.length}
            saasCount={saasProducts.length}
            poemCount={poems.length}
          />

          <PortfolioSection
            projects={projects}
            isAdmin={isAdmin}
            onAddProject={() => openDashboard('projects')}
            onEditProject={(project) => {
              if (!isAdmin) return;
              setEditingProduct(null);
              setEditingPoem(null);
              setEditingProject(project);
              setDataManagerTab('projects');
              setDataManagerOpen(true);
            }}
          />

          <SaaSSection
            products={saasProducts}
            isAdmin={isAdmin}
            onAddProduct={() => openDashboard('saas')}
            onEditProduct={(product) => {
              if (!isAdmin) return;
              setEditingProject(null);
              setEditingPoem(null);
              setEditingProduct(product);
              setDataManagerTab('saas');
              setDataManagerOpen(true);
            }}
            onOpenProductModal={handleOpenProductModal}
          />

          <PoetrySection
            poems={poems}
            isAdmin={isAdmin}
            onAddPoem={() => openDashboard('poems')}
            onEditPoem={(poem) => {
              if (!isAdmin) return;
              setEditingProject(null);
              setEditingProduct(null);
              setEditingPoem(poem);
              setDataManagerTab('poems');
              setDataManagerOpen(true);
            }}
          />

          <AboutSection
            profile={profile}
            isAdmin={isAdmin}
            signedInEmail={user?.email ?? null}
            authNotice={authNotice}
            onAdminLogin={() => void handleAdminLogin()}
            onAdminLogout={() => void handleAdminLogout()}
            onOpenDataManager={() => openDashboard('overview')}
            onEditProfile={() => openDashboard('profile')}
          />
        </div>
      </main>

      {/* Interactive SaaS Demo & Subscription Modal */}
      <SaaSDemoModal
        product={activeProduct}
        mode={productModalMode}
        onClose={() => setActiveProduct(null)}
        onSwitchMode={setProductModalMode}
      />

      {/* Admin-only Full CMS Dashboard Modal */}
      {isAdmin && (
        <DataManagerModal
          isOpen={dataManagerOpen}
          initialTab={dataManagerTab}
          editingProject={editingProject}
          editingProduct={editingProduct}
          editingPoem={editingPoem}
          projects={projects}
          saasProducts={saasProducts}
          poems={poems}
          profile={profile}
          isBusy={isMutating}
          onClose={() => {
            setDataManagerOpen(false);
            setEditingProject(null);
            setEditingProduct(null);
            setEditingPoem(null);
          }}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onSavePoem={handleSavePoem}
          onDeletePoem={handleDeletePoem}
          onSaveProfile={handleSaveProfile}
          onResetDefaults={handleResetDefaults}
        />
      )}
    </div>
  );
}
