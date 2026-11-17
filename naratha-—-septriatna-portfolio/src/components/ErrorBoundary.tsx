import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Terjadi kesalahan pada aplikasi.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090B] text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-[#111114] p-7 space-y-4">
            <h1 className="text-xl font-bold text-white">
              Gangguan Koneksi atau Akses Data
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Aplikasi mengalami kendala saat memuat atau menyimpan data.
              Silakan muat ulang halaman ini.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
