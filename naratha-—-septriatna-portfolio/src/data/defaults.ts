import { Poem, Project, SaaSProduct, SiteProfile } from '../types';

export const HERO_IMAGE_URL =
  '/src/assets/images/hero_architecture_studio_1794905729576.jpg';

export const DEFAULT_SITE_PROFILE: SiteProfile = {
  heroKicker: 'Arsitektur · Manajemen Konstruksi · Aplikasi Bisnis',
  heroTitle: "Hi, I'm Septriatna (Naratha)",
  heroSubtitle:
    'Merancang ruang hunian dan komersial dari garis konsep hingga pengawasan lapangan yang terukur, sekaligus membangun perangkat lunak bisnis yang menyelesaikan persoalan operasional properti, gudang, dan keuangan secara nyata.',
  heroImageUrl: HERO_IMAGE_URL,
  heroImageCaption: 'Studi Fasad & Pencahayaan Tropis',
  heroImageLocation: 'Bandung · Sumedang',
  aboutHeading: 'Septriatna & Identitas NARATHA',
  aboutBio:
    'Di balik nama NARATHA, saya menggabungkan disiplin keteknikan bangunan dengan rekayasa perangkat lunak praktis—dua dunia yang sama-sama menuntut ketelitian struktur, kejelasan alur, dan ketahanan jangka panjang.',
  contactEmail: 'naraakarya@gmail.com',
  pillar1Title: 'Arsitektur & Drafting',
  pillar1Desc:
    'Perancangan siteplan kawasan, fasad hunian tropis, hingga gambar kerja DED siap bangun yang presisi.',
  pillar2Title: 'Konstruksi & RAB',
  pillar2Desc:
    'Penyusunan BoQ/AHSP, pengendalian anggaran biaya proyek, serta pengawasan kualitas pelaksanaan di lapangan.',
  pillar3Title: 'Aplikasi & Sastra',
  pillar3Desc:
    'Membangun sistem SaaS operasional bisnis (keuangan sewa, gudang, utilitas air) serta menulis puisi sebagai ruang refleksi.',
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-pasirnanjung',
    title: 'Perumahan Bumi Pasirnanjung Indah',
    category: 'Arsitektur',
    year: '2025',
    location: 'Sumedang, Jawa Barat',
    client: 'PT Bumi Pasirnanjung Mandiri',
    area: '4.2 Hektare · 118 Unit',
    budgetSummary: 'Rp 18,4 Miliar',
    summary:
      'Perancangan masterplan kawasan hunian tropis modern, desain fasad tipe 45 dan 60 dengan bukaan silang alami, serta penataan infrastruktur drainase dan jalan lingkungan.',
    deliverables: [
      'Siteplan Kawasan & Kavling Efektif',
      'Desain Arsitektur 3 Tipe Hunian',
      'Gambar Kerja IMB/PBG Lengkap',
    ],
    imageUrl: '/src/assets/images/project_pasirnanjung_1794905730445.jpg',
    featured: true,
  },
  {
    id: 'proj-drafter-cad',
    title: 'Gambar Kerja Drafter & Detail Struktur Kawasan',
    category: 'Arsitektur',
    year: '2024',
    location: 'Bandung Timur',
    client: 'Studio & Kontraktor Mitra',
    area: '2.450 m² Total Lantai',
    budgetSummary: 'Paket DED Lengkap',
    summary:
      'Penyusunan Detailed Engineering Design (DED) mencakup denah arsitektural, potongan memanjang-melintang, detail penulangan struktur beton bertulang, serta skematik MEP.',
    deliverables: [
      'Shop Drawing Arsitektur & Struktur',
      'Detail Pembesian Pondasi & Balok',
      'Koordinasi As-Built Drawing',
    ],
    imageUrl: '/src/assets/images/project_drafter_cad_1794905730905.jpg',
    featured: false,
  },
  {
    id: 'proj-ruko-komersial',
    title: 'Konstruksi Ruko Komersial & Ruang Usaha 3 Lantai',
    category: 'Konstruksi Lapangan',
    year: '2025',
    location: 'Cimanggung, Kab. Sumedang',
    client: 'Naratha Properti Komersial',
    area: '1.080 m² · 6 Unit Ruko',
    budgetSummary: 'Rp 4,9 Miliar',
    summary:
      'Pengawasan langsung pelaksanaan lapangan mulai dari pekerjaan galian struktur, pengecoran kolom dan pelat lantai, pengendalian mutu material, hingga serah terima tepat waktu.',
    deliverables: [
      'Manajemen Mandor & Subkontraktor',
      'Laporan Progres Mingguan & Opname',
      'Kontrol Mutu Beton & Finishing',
    ],
    imageUrl:
      '/src/assets/images/project_konstruksi_lapangan_1794905731736.jpg',
    featured: false,
  },
  {
    id: 'proj-rab-infrastruktur',
    title: 'Perencanaan RAB, AHSP & Kurva-S Proyek Terpadu',
    category: 'Perencanaan RAB',
    year: '2024',
    location: 'Jawa Barat',
    client: 'Pengembang & Pemilik Proyek Swasta',
    area: 'Skala Hunian & Komersial',
    budgetSummary: 'Efisiensi Biaya 11%',
    summary:
      'Penyusunan Rencana Anggaran Biaya berbasis Analisis Harga Satuan Pekerjaan (AHSP), Bill of Quantities (BoQ), jadwal pengadaan material, serta penjadwalan Kurva-S mingguan.',
    deliverables: [
      'Bill of Quantities (BoQ) Terperinci',
      'Jadwal Pengadaan Material & Termin',
      'Simulasi Arus Kas Konstruksi',
    ],
    imageUrl: '/src/assets/images/project_rab_perencanaan_1794905731199.jpg',
    featured: false,
  },
  {
    id: 'proj-hunian-tropis',
    title: 'Villa & Rumah Tinggal Tropis Beton Ekspose',
    category: 'Konstruksi Lapangan',
    year: '2023',
    location: 'Lembang, Bandung Barat',
    client: 'Klien Privat',
    area: '340 m² Lahan · 260 m² Bangunan',
    budgetSummary: 'Rp 2,15 Miliar',
    summary:
      'Pelaksanaan konstruksi hunian berkontur dengan dinding beton ekspose, kisi-kisi kayu jati solid, dan tata pencahayaan lanskap yang menyatu dengan kontur perbukitan.',
    deliverables: [
      'Pekerjaan Dinding Penahan Tanah',
      'Pemasangan Fasad Kayu & Kaca Bentang Lebar',
      'Instalasi Pencahayaan Eksterior',
    ],
    imageUrl: HERO_IMAGE_URL,
    featured: false,
  },
];

export const DEFAULT_SAAS_PRODUCTS: SaaSProduct[] = [
  {
    id: 'saas-naratha-finance',
    name: 'NARATHA FINANCE',
    domainLabel: 'Manajemen Sewa Ruko & Properti',
    tagline: 'Kendali penuh sewa ruko, jatuh tempo kontrak, dan arus kas.',
    description:
      'Platform manajemen unit komersial dan ruko untuk memantau status sewa penyewa, pengingat jatuh tempo otomatis, pencatatan deposit, hingga laporan laba rugi bulanan.',
    priceLabel: 'Rp 290.000',
    billingPeriod: 'per bulan · hingga 50 unit',
    features: [
      'Buku besar penyewa & kontrak tahunan',
      'Status lunas, cicilan & tunggakan real-time',
      'Rekap arus kas masuk & biaya perawatan',
    ],
    demoType: 'finance',
  },
  {
    id: 'saas-gudang-proyek',
    name: 'Sistem Manajemen Gudang Proyek',
    domainLabel: 'Logistik & Material Konstruksi',
    tagline: 'Lacak stok semen, besi, dan surat jalan antar-proyek tanpa selisih.',
    description:
      'Aplikasi pencatatan barang masuk dari supplier dan distribusi material ke lapangan. Menghindari kebocoran stok di gudang proyek dengan riwayat audit yang rapi.',
    priceLabel: 'Rp 240.000',
    billingPeriod: 'per bulan · multi-lokasi gudang',
    features: [
      'Kartu stok keluar-masuk per proyek',
      'Peringatan batas minimum material kritis',
      'Cetak surat jalan & laporan opname stok',
    ],
    demoType: 'warehouse',
  },
  {
    id: 'saas-penagihan-air',
    name: 'Sistem Penagihan Air Perumahan',
    domainLabel: 'Utilitas & Iuran Klaster',
    tagline: 'Catat meter air warga, hitung tarif progresif, dan terbitkan tagihan.',
    description:
      'Dirancang khusus untuk pengelola perumahan dan paguyuban klaster. Petugas cukup input angka meter akhir setiap bulan untuk langsung menghasilkan tagihan terperinci.',
    priceLabel: 'Rp 195.000',
    billingPeriod: 'per bulan · hingga 300 rumah',
    features: [
      'Kalkulasi pemakaian m³ & biaya abonemen',
      'Riwayat pembayaran warga per blok rumah',
      'Rekap kas bulanan untuk pengelola klaster',
    ],
    demoType: 'water',
  },
  {
    id: 'saas-kalkulator-rab',
    name: 'Estimasi RAB & Progres Kontraktor',
    domainLabel: 'Perencanaan Biaya Konstruksi',
    tagline: 'Hitung BoQ, volume pekerjaan, dan persentase termin dalam hitungan menit.',
    description:
      'Alat bantu praktis bagi drafter, estimator, dan kontraktor untuk menyusun rincian harga satuan pekerjaan serta memantau bobot progres fisik di lapangan.',
    priceLabel: 'Rp 320.000',
    billingPeriod: 'per bulan · proyek tak terbatas',
    features: [
      'Database harga satuan bahan & upah',
      'Simulasi margin kontraktor & PPN',
      'Ringkasan estimasi siap kirim ke klien',
    ],
    demoType: 'rab',
  },
];

export const DEFAULT_POEMS: Poem[] = [
  {
    id: 'poem-1',
    title: 'Di Antara Garis dan Senja',
    excerpt:
      'Setiap beton yang berdiri tegak bermula dari sepi yang berani diukur dengan sabar.',
    stanzas: [
      'Di atas meja kayu yang dingin oleh malam,',
      'garis-garis tipis menunggu untuk dipercaya.',
      'Bukan sekadar batas antara ruang dan halaman,',
      'melainkan cara manusia merawat pulangnya.',
      '',
      'Setiap beton yang berdiri tegak,',
      'bermula dari sepi yang berani diukur dengan sabar.',
      'Dan ketika senja jatuh di ambang jendela,',
      'cahaya selalu tahu di sudut mana ia harus tinggal.',
    ],
    theme: 'Ruang & Ketekunan',
    writtenYear: '2025',
    authorNote: 'Ditulis setelah meninjau pengecoran tahap akhir di Sumedang.',
  },
  {
    id: 'poem-2',
    title: 'Hujan di Pasirnanjung',
    excerpt:
      'Tanah merah menyimpan jejak langkah mereka yang membangun tanpa banyak bicara.',
    stanzas: [
      'Hujan turun lebih dulu sebelum atap-atap terpasang,',
      'membasahi pondasi batu kali yang baru saja diam.',
      'Tanah merah menyimpan jejak langkah mereka',
      'yang membangun tanpa banyak bicara.',
      '',
      'Esok pagi matahari akan mengeringkan lumpur,',
      'menyisakan dinding yang belajar berdiri sendiri.',
      'Sebagaimana doa yang tak perlu suara lantang,',
      'cukup kokoh menopang hari-hari yang datang.',
    ],
    theme: 'Alam & Tanah',
    writtenYear: '2024',
    authorNote: 'Catatan lapangan musim penghujan, November.',
  },
  {
    id: 'poem-3',
    title: 'Logika Sunyi',
    excerpt:
      'Ada puisi di balik barisan angka, jika kau tahu ke mana rindu sedang dihitung.',
    stanzas: [
      'Orang-orang mengira dunia hanya terbagi dua:',
      'yang dihitung dengan rumus, dan yang dirasa dengan dada.',
      'Padahal jembatan paling indah sekalipun',
      'lahir dari rindu yang diberi tumpuan yang tepat.',
      '',
      'Ada puisi di balik barisan angka,',
      'jika kau tahu ke mana lelah sedang bermuara.',
      'Sebab baik kode maupun semen yang mengeras,',
      'sama-sama ingin berguna bagi hidup yang singgah.',
    ],
    theme: 'Karya & Makna',
    writtenYear: '2025',
  },
  {
    id: 'poem-4',
    title: 'Jendela Menghadap Timur',
    excerpt:
      'Jangan tutup seluruh dinding dengan kepastian; sisakan celah agar pagi bisa mengetuk.',
    stanzas: [
      'Jangan tutup seluruh dinding dengan kepastian,',
      'sisakan celah agar pagi bisa mengetuk pelan.',
      'Rumah yang baik bukan yang paling tinggi pagarnya,',
      'melainkan yang membuat penghuninya betah bernapas.',
      '',
      'Kita pun demikian adanya:',
      'perlu ruang kosong untuk mendengar diri sendiri,',
      'sebelum kembali menata batu demi batu',
      'atas nama masa depan yang belum selesai.',
    ],
    theme: 'Refleksi',
    writtenYear: '2024',
  },
  {
    id: 'poem-5',
    title: 'Tinta di Ujung Hari',
    excerpt:
      'Ketika deru proyek mereda, kata-kata mengambil alih tugas menjaga ingatan.',
    stanzas: [
      'Ketika deru mesin adukan akhirnya mereda,',
      'dan lampu jalan mulai menyala satu per satu,',
      'aku menanggalkan helm serta peta lapangan,',
      'lalu duduk bersama secangkir kopi yang nyaris dingin.',
      '',
      'Kata-kata mengambil alih tugas menjaga ingatan,',
      'merangkum letih menjadi bait yang tenang.',
      'Agar kelak, bila usia menoleh ke belakang,',
      'yang tersisa bukan hanya bangunan, tapi juga rasa.',
    ],
    theme: 'Sastra & Malam',
    writtenYear: '2026',
  },
  {
    id: 'poem-6',
    title: 'Skala Satu Banding Seratus',
    excerpt:
      'Di atas kertas semuanya tampak kecil, sampai kita berjalan di dalamnya dengan seluruh hidup.',
    stanzas: [
      'Di atas kertas putih, satu sentimeter adalah satu meter;',
      'begitu ringkas, begitu mudah digeser dengan penghapus.',
      'Namun di atas tanah yang nyata,',
      'satu kesalahan ukur adalah keringat berhari-hari.',
      '',
      'Maka aku belajar rendah hati pada setiap detail kecil,',
      'sebab hidup tidak pernah dibangun dengan skala perkiraan—',
      'ia dijalani utuh, satu banding satu,',
      'dari pagi hingga malam menutup pintu.',
    ],
    theme: 'Arsitektur & Hidup',
    writtenYear: '2025',
  },
];
