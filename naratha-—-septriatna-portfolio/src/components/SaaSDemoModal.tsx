import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Minus, Plus, X } from 'lucide-react';
import { SaaSProduct } from '../types';

interface SaaSDemoModalProps {
  product: SaaSProduct | null;
  mode: 'demo' | 'subscribe';
  onClose: () => void;
  onSwitchMode: (mode: 'demo' | 'subscribe') => void;
}

interface RukoUnit {
  id: string;
  unit: string;
  tenant: string;
  monthlyRent: number;
  paid: boolean;
}

interface WarehouseItem {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
}

export const SaaSDemoModal: React.FC<SaaSDemoModalProps> = ({
  product,
  mode,
  onClose,
  onSwitchMode,
}) => {
  // Demo 1: NARATHA FINANCE Ruko Rent Tracker
  const [rukoUnits, setRukoUnits] = useState<RukoUnit[]>([
    {
      id: 'r1',
      unit: 'Ruko A-01',
      tenant: 'Apotek Sehat Mandiri',
      monthlyRent: 4500000,
      paid: true,
    },
    {
      id: 'r2',
      unit: 'Ruko A-02',
      tenant: 'Kopi Senja Nusantara',
      monthlyRent: 4200000,
      paid: false,
    },
    {
      id: 'r3',
      unit: 'Ruko B-01',
      tenant: 'Klinik Gigi Pratama',
      monthlyRent: 5000000,
      paid: true,
    },
  ]);

  // Demo 2: Warehouse Stock Ledger
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([
    { id: 'w1', name: 'Semen Portland 50kg', unit: 'Sak', stock: 185, minStock: 50 },
    { id: 'w2', name: 'Besi Beton Ulir D13', unit: 'Batang', stock: 92, minStock: 40 },
    { id: 'w3', name: 'Cat Eksterior Weatherproof', unit: 'Pail', stock: 14, minStock: 10 },
  ]);

  // Demo 3: Water Billing Calculator
  const [prevMeter, setPrevMeter] = useState<number>(142);
  const [currMeter, setCurrMeter] = useState<number>(168);
  const [tariffPerM3, setTariffPerM3] = useState<number>(4500);
  const abonemen = 15000;

  // Demo 4: Quick RAB Estimator
  const [buildingArea, setBuildingArea] = useState<number>(90);
  const [costPerM2, setCostPerM2] = useState<number>(4200000);
  const [contingencyPct, setContingencyPct] = useState<number>(5);

  // Custom App Interactive Checklist Preview
  const [checkedFeatures, setCheckedFeatures] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  // Subscription Inquiry Form
  const [subName, setSubName] = useState('');
  const [subCompany, setSubCompany] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subPlan, setSubPlan] = useState<'Bulanan' | 'Tahunan'>('Tahunan');
  const [subSubmitted, setSubSubmitted] = useState(false);

  useEffect(() => {
    setSubSubmitted(false);
  }, [product, mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const toggleRukoPaid = (id: string) => {
    setRukoUnits((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, paid: !item.paid } : item
      )
    );
  };

  const adjustStock = (id: string, delta: number) => {
    setWarehouseItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock: Math.max(0, item.stock + delta) }
          : item
      )
    );
  };

  const waterUsage = Math.max(0, currMeter - prevMeter);
  const waterBillTotal = waterUsage * tariffPerM3 + abonemen;

  const baseRab = Math.max(0, buildingArea) * Math.max(0, costPerM2);
  const totalRab = baseRab + (baseRab * contingencyPct) / 100;

  const totalRukoCollected = rukoUnits
    .filter((r) => r.paid)
    .reduce((acc, r) => acc + r.monthlyRent, 0);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subEmail.trim()) return;
    setSubSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saas-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#111114] text-zinc-100 shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 bg-[#111114]/95 backdrop-blur-md border-b border-zinc-800/80">
          <div>
            <p className="text-xs text-[#E5A93C] font-medium">
              {product.domainLabel}
            </p>
            <h3 id="saas-modal-title" className="text-lg font-bold text-white">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-[#18181D] border border-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => onSwitchMode('demo')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === 'demo'
                    ? 'bg-[#E5A93C] text-[#09090B]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Simulasi Demo
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode('subscribe')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === 'subscribe'
                    ? 'bg-[#E5A93C] text-[#09090B]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Langganan
              </button>
            </div>

            <button
              type="button"
              aria-label="Tutup modal"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {mode === 'demo' ? (
            <div className="space-y-5">
              <p className="text-sm text-zinc-400">
                Uji coba interaktif langsung di peramban. Ubah status atau angka
                di bawah untuk melihat kalkulasi sistem secara instan.
              </p>

              {/* FINANCE DEMO */}
              {product.demoType === 'finance' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#16161B] border border-zinc-800/80">
                    <div>
                      <p className="text-xs text-zinc-400">
                        Total Sewa Terkumpul Bulan Ini
                      </p>
                      <p className="mt-1 text-xl font-mono font-bold text-[#E5A93C] tabular-nums">
                        {formatIDR(totalRukoCollected)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Unit Lunas</p>
                      <p className="mt-1 text-base font-mono font-semibold text-white tabular-nums">
                        {rukoUnits.filter((r) => r.paid).length} /{' '}
                        {rukoUnits.length} Unit
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 overflow-hidden bg-[#141418]">
                    {rukoUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="p-4 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {unit.unit} · {unit.tenant}
                          </p>
                          <p className="text-xs font-mono text-zinc-400 tabular-nums mt-0.5">
                            {formatIDR(unit.monthlyRent)} / bulan
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleRukoPaid(unit.id)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                            unit.paid
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-950'
                              : 'bg-amber-950/50 text-amber-300 border border-amber-700/60 hover:bg-amber-950'
                          }`}
                        >
                          {unit.paid ? 'Status: Lunas' : 'Tandai Lunas'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WAREHOUSE DEMO */}
              {product.demoType === 'warehouse' && (
                <div className="space-y-4">
                  <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 overflow-hidden bg-[#141418]">
                    {warehouseItems.map((item) => {
                      const isLow = item.stock <= item.minStock;
                      return (
                        <div
                          key={item.id}
                          className="p-4 flex flex-wrap items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {item.name}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5 tabular-nums">
                              Batas minimum: {item.minStock} {item.unit}
                              {isLow ? ' · Perlu Restok Segera' : ' · Stok Aman'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              aria-label={`Kurangi stok ${item.name}`}
                              onClick={() => adjustStock(item.id, -5)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 bg-[#1B1B20] text-zinc-200 hover:border-zinc-500"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="min-w-[72px] text-center font-mono text-sm font-semibold text-white tabular-nums">
                              {item.stock} {item.unit}
                            </span>
                            <button
                              type="button"
                              aria-label={`Tambah stok ${item.name}`}
                              onClick={() => adjustStock(item.id, 5)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 bg-[#1B1B20] text-zinc-200 hover:border-zinc-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WATER BILLING DEMO */}
              {product.demoType === 'water' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-xs text-zinc-400">
                        Meter Bulan Lalu (m³)
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={prevMeter}
                        onChange={(e) => setPrevMeter(Number(e.target.value) || 0)}
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-zinc-400">
                        Meter Bulan Ini (m³)
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={currMeter}
                        onChange={(e) => setCurrMeter(Number(e.target.value) || 0)}
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-zinc-400">
                        Tarif per m³ (Rp)
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={500}
                        value={tariffPerM3}
                        onChange={(e) =>
                          setTariffPerM3(Number(e.target.value) || 0)
                        }
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                  </div>

                  <div className="p-5 rounded-xl bg-[#16161B] border border-zinc-800/80 space-y-2.5">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Pemakaian Air Bersih</span>
                      <span className="font-mono text-zinc-200 tabular-nums">
                        {waterUsage} m³
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Biaya Abonemen Klaster</span>
                      <span className="font-mono text-zinc-200 tabular-nums">
                        {formatIDR(abonemen)}
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-zinc-800 flex justify-between items-baseline">
                      <span className="text-sm font-medium text-white">
                        Total Tagihan Warga
                      </span>
                      <span className="text-xl font-mono font-bold text-[#E5A93C] tabular-nums">
                        {formatIDR(waterBillTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RAB CALCULATOR DEMO */}
              {product.demoType === 'rab' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-xs text-zinc-400">
                        Luas Bangunan (m²)
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={buildingArea}
                        onChange={(e) =>
                          setBuildingArea(Number(e.target.value) || 0)
                        }
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-zinc-400">
                        Standar Biaya / m² (Rp)
                      </span>
                      <input
                        type="number"
                        min={500000}
                        step={100000}
                        value={costPerM2}
                        onChange={(e) =>
                          setCostPerM2(Number(e.target.value) || 0)
                        }
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-zinc-400">
                        Cadangan Tak Terduga (%)
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={contingencyPct}
                        onChange={(e) =>
                          setContingencyPct(Number(e.target.value) || 0)
                        }
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                  </div>

                  <div className="p-5 rounded-xl bg-[#16161B] border border-zinc-800/80 space-y-2.5">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Subtotal Konstruksi Fisik</span>
                      <span className="font-mono text-zinc-200 tabular-nums">
                        {formatIDR(baseRab)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Cadangan Risiko ({contingencyPct}%)</span>
                      <span className="font-mono text-zinc-200 tabular-nums">
                        {formatIDR((baseRab * contingencyPct) / 100)}
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-zinc-800 flex justify-between items-baseline">
                      <span className="text-sm font-medium text-white">
                        Estimasi Total RAB
                      </span>
                      <span className="text-xl font-mono font-bold text-[#E5A93C] tabular-nums">
                        {formatIDR(totalRab)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOM SAAS DEMO */}
              {product.demoType === 'custom' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#16161B] border border-zinc-800/80">
                    <p className="text-sm font-medium text-white">
                      {product.tagline}
                    </p>
                    <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-[#141418]">
                    {product.features.map((feat, idx) => {
                      const active = Boolean(checkedFeatures[idx]);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setCheckedFeatures((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                          className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-[#18181D] transition-colors"
                        >
                          <span className="text-sm text-zinc-200">{feat}</span>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-md border ${
                              active
                                ? 'border-[#E5A93C] text-[#E5A93C] bg-[#1E1A12]'
                                : 'border-zinc-700 text-zinc-500'
                            }`}
                          >
                            {active ? 'Dipilih' : 'Pilih Modul'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-zinc-500">
                  Ingin implementasi penuh untuk tim atau usaha Anda?
                </span>
                <button
                  type="button"
                  onClick={() => onSwitchMode('subscribe')}
                  className="px-4 py-2 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors"
                >
                  Lanjut ke Paket Langganan
                </button>
              </div>
            </div>
          ) : (
            /* SUBSCRIPTION FORM */
            <div>
              {subSubmitted ? (
                <div className="py-6 text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-[#E5A93C] mx-auto" />
                  <h4 className="text-xl font-bold text-white">
                    Permintaan Langganan Tercatat
                  </h4>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Terima kasih,{' '}
                    <span className="font-semibold text-white">{subName}</span>.
                    Detail akses dan jadwal onboarding untuk{' '}
                    <span className="text-[#E5A93C]">{product.name}</span> (Paket{' '}
                    {subPlan}) telah disiapkan untuk dikirim ke{' '}
                    <span className="font-mono text-zinc-100">{subEmail}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 px-5 py-2.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors"
                  >
                    Selesai
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-5">
                  <div className="p-4 rounded-xl bg-[#16161B] border border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-zinc-400">Biaya Lisensi</p>
                      <p className="mt-1 text-xl font-mono font-bold text-white tabular-nums">
                        {product.priceLabel}{' '}
                        <span className="text-xs font-sans font-normal text-zinc-400">
                          {product.billingPeriod}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center p-1 bg-[#111114] border border-zinc-800 rounded-lg">
                      {(['Bulanan', 'Tahunan'] as const).map((plan) => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => setSubPlan(plan)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            subPlan === plan
                              ? 'bg-[#E5A93C] text-[#09090B]'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {plan}
                        </button>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-zinc-300">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="block">
                      <span className="text-xs text-zinc-400">Nama Lengkap</span>
                      <input
                        type="text"
                        required
                        placeholder="Nama Anda"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-zinc-400">
                        Perusahaan / Klaster
                      </span>
                      <input
                        type="text"
                        placeholder="Nama usaha atau perumahan"
                        value={subCompany}
                        onChange={(e) => setSubCompany(e.target.value)}
                        className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E5A93C]"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs text-zinc-400">
                      Email atau Nomor WhatsApp
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="contoh@perusahaan.co.id"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#16161B] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E5A93C]"
                    />
                  </label>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-lg border border-zinc-700 text-sm font-medium text-zinc-300 hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#E5A93C] text-[#09090B] text-sm font-semibold hover:bg-[#F0B94E] transition-colors"
                    >
                      Aktifkan Langganan
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
