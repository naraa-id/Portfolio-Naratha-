import React from 'react';
import {
  Building,
  Calculator,
  Check,
  Droplets,
  Layers,
  Package,
  Pencil,
  Play,
  Plus,
} from 'lucide-react';
import { SaaSDemoType, SaaSProduct } from '../types';

interface SaaSSectionProps {
  products: SaaSProduct[];
  isAdmin: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: SaaSProduct) => void;
  onOpenProductModal: (product: SaaSProduct, mode: 'demo' | 'subscribe') => void;
}

const DEMO_ICONS: Record<
  SaaSDemoType,
  React.ComponentType<{ className?: string }>
> = {
  finance: Building,
  warehouse: Package,
  water: Droplets,
  rab: Calculator,
  custom: Layers,
};

export const SaaSSection: React.FC<SaaSSectionProps> = ({
  products,
  isAdmin,
  onAddProduct,
  onEditProduct,
  onOpenProductModal,
}) => {
  return (
    <section
      id="aplikasi"
      className="py-16 lg:py-20 border-b border-zinc-800/80 scroll-mt-16 lg:scroll-mt-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs text-[#E5A93C] font-medium tracking-wide">
            02. Produk Digital &amp; Otomasi
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Etalase Aplikasi &amp; SaaS Bisnis
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Perangkat lunak yang lahir dari kebutuhan nyata di proyek konstruksi,
            pengelolaan gudang material, penagihan utilitas perumahan, dan
            administrasi sewa properti komersial.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={onAddProduct}
            className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-lg border border-zinc-700 bg-[#121215] text-sm font-medium text-zinc-100 hover:border-[#E5A93C] hover:text-[#E5A93C] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah Aplikasi</span>
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-zinc-800/80 bg-[#111114] p-10 text-center">
          <p className="text-base font-medium text-zinc-200">
            Belum ada aplikasi dalam etalase.
          </p>
          {isAdmin && (
            <button
              type="button"
              onClick={onAddProduct}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aplikasi Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => {
            const Icon = DEMO_ICONS[product.demoType] ?? Layers;
            return (
              <article
                key={product.id}
                className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-6 sm:p-7 flex flex-col justify-between transition-colors hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-zinc-400">
                        {product.domainLabel}
                      </p>
                      <h3 className="mt-1.5 text-xl font-bold text-white tracking-tight">
                        {product.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#18181D] border border-zinc-800 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#E5A93C]" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-zinc-200">
                    {product.tagline}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {product.description}
                  </p>

                  <ul className="mt-5 pt-5 border-t border-zinc-800/70 space-y-2.5 text-sm text-zinc-300">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-800/70 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-mono font-bold text-white tabular-nums">
                        {product.priceLabel}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {product.billingPeriod}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenProductModal(product, 'demo')}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-700 bg-[#16161B] text-xs sm:text-sm font-medium text-zinc-100 hover:border-zinc-500 hover:text-white transition-colors whitespace-nowrap"
                      >
                        <Play className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>Coba Demo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenProductModal(product, 'subscribe')}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-xs sm:text-sm font-semibold hover:bg-[#F0B94E] transition-colors whitespace-nowrap"
                      >
                        Langganan
                      </button>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="pt-3 border-t border-zinc-800/60 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#E5A93C] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Produk</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
