const MAX_IMAGE_DATA_URL_LENGTH = 430000;
const MAX_DIMENSION = 1200;

export async function compressImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File yang dipilih bukan gambar yang valid.');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Gagal membaca file gambar.'));
      image.src = objectUrl;
    });

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Browser tidak mendukung pemrosesan gambar.');
    }

    let quality = 0.82;
    let currentWidth = width;
    let currentHeight = height;

    for (let attempt = 0; attempt < 6; attempt++) {
      canvas.width = currentWidth;
      canvas.height = currentHeight;
      ctx.clearRect(0, 0, currentWidth, currentHeight);
      ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      if (dataUrl.length <= MAX_IMAGE_DATA_URL_LENGTH) {
        return dataUrl;
      }

      quality = Math.max(0.45, quality - 0.12);
      currentWidth = Math.max(480, Math.round(currentWidth * 0.82));
      currentHeight = Math.max(320, Math.round(currentHeight * 0.82));
    }

    throw new Error(
      'Ukuran gambar terlalu besar setelah dikompresi. Gunakan foto yang lebih ringan.'
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const PRESET_PROJECT_IMAGES: { label: string; url: string }[] = [
  {
    label: 'Perumahan Tropis',
    url: '/src/assets/images/project_pasirnanjung_1794905730445.jpg',
  },
  {
    label: 'Gambar Kerja Drafter',
    url: '/src/assets/images/project_drafter_cad_1794905730905.jpg',
  },
  {
    label: 'Konstruksi Lapangan',
    url: '/src/assets/images/project_konstruksi_lapangan_1794905731736.jpg',
  },
  {
    label: 'Perencanaan RAB',
    url: '/src/assets/images/project_rab_perencanaan_1794905731199.jpg',
  },
  {
    label: 'Arsitektur Dusk',
    url: '/src/assets/images/hero_architecture_studio_1794905729576.jpg',
  },
];
