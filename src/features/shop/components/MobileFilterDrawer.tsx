'use client';

import { useEffect, useRef, useState } from 'react';
import { SORT_OPTIONS } from '@/lib/constants';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { PriceRangeSlider } from './PriceRangeSlider';
import type { FiltersData } from '@/types/common';

function IconFilter({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function IconClose({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
    </svg>
  );
}

function IconArrow({ size = 14, flip = false }: { size?: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 14 10"
      fill="none"
      width={size}
      height={(size * 10) / 14}
      aria-hidden="true"
      focusable="false"
      className={`transition-transform duration-[220ms] ease-in-out ${flip ? 'rotate-180' : ''}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
    </svg>
  );
}

function FilterCheckbox({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className="w-full flex items-center justify-between py-[10px] px-0 cursor-pointer text-[15px] text-[#222] bg-transparent border-none text-left"
    >
      <span className="flex items-center gap-[12px]">
        <span
          className={`w-[20px] h-[20px] border-[1.5px] border-solid rounded-[4px] inline-flex items-center justify-center transition-all duration-[180ms] ease-in-out shrink-0 ${
            checked ? 'border-[#222] bg-[#222]' : 'border-[#c5c5c5] bg-[#fff]'
          }`}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        {label}
      </span>
      <span className="text-[15px] text-[#555]">{count}</span>
    </button>
  );
}

function FilterRadio({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className="w-full flex items-center justify-between py-[10px] px-0 cursor-pointer text-[15px] text-[#222] bg-transparent border-none text-left"
    >
      <span className="flex items-center gap-[12px]">
        <span
          className={`w-[20px] h-[20px] border-[1.5px] border-solid rounded-full inline-flex items-center justify-center bg-[#fff] transition-all duration-[180ms] ease-in-out shrink-0 ${
            checked ? 'border-[#222]' : 'border-[#c5c5c5]'
          }`}
        >
          {checked && (
            <span className="w-[10px] h-[10px] rounded-full bg-[#222]" />
          )}
        </span>
        <span className={checked ? 'font-semibold' : 'font-normal'}>{label}</span>
      </span>
      <span className="text-[15px] text-[#555]">{count}</span>
    </button>
  );
}

type SubKey = 'availability' | 'price' | 'brand' | 'color' | 'size' | 'category';

interface PendingState {
  availability: string;
  brand: string;
  color: string;
  size: string;
  category: string;
  subcategory: string;
  sort: string;
  priceRange: [number, number];
}

export interface MobileFilterApplyPayload {
  availability: string;
  brand: string;
  color: string;
  size: string;
  category: string;
  subcategory: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
}

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FiltersData | undefined;
  selected: {
    availability: string;
    brand: string;
    color: string;
    size: string;
    category: string;
    subcategory?: string;
    sort: string;
  };
  priceRange: [number, number];
  productCount: number;
  onApply: (payload: MobileFilterApplyPayload) => void;
  onRemoveAll: () => void;
  theme?: { accentColor: string; mutedColor: string; textColor: string };
}

export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  selected,
  priceRange,
  productCount,
  onApply,
  onRemoveAll,
  theme,
}: MobileFilterDrawerProps) {
  const [view, setView] = useState<'main' | SubKey>('main');
  const [sortOpen, setSortOpen] = useState(false);
  const [pending, setPending] = useState<PendingState>({
    availability: selected.availability,
    brand: selected.brand,
    color: selected.color,
    size: selected.size,
    category: selected.category,
    subcategory: selected.subcategory || '',
    sort: selected.sort,
    priceRange,
  });

  const selectedRef = useRef(selected);
  const priceRangeRef = useRef(priceRange);
  selectedRef.current = selected;
  priceRangeRef.current = priceRange;

  useEffect(() => {
    if (open) {
      setPending({
        availability: selectedRef.current.availability,
        brand: selectedRef.current.brand,
        color: selectedRef.current.color,
        size: selectedRef.current.size,
        category: selectedRef.current.category,
        subcategory: selectedRef.current.subcategory || '',
        sort: selectedRef.current.sort,
        priceRange: priceRangeRef.current,
      });
      setView('main');
      setSortOpen(false);
    }
  }, [open]);

  useLockBodyScroll(open);

  const handleApply = () => {
    onApply({
      availability: pending.availability,
      brand: pending.brand,
      color: pending.color,
      size: pending.size,
      category: pending.category,
      subcategory: pending.subcategory,
      sort: pending.sort,
      minPrice: pending.priceRange[0],
      maxPrice: pending.priceRange[1],
    });
    onClose();
  };

  const handleRemoveAll = () => {
    setPending({
      availability: '',
      brand: '',
      color: '',
      size: '',
      category: '',
      subcategory: '',
      sort: 'featured',
      priceRange: [0, filters?.priceRange.max ?? 100],
    });
    onRemoveAll();
    onClose();
  };

  const handleClearSub = (key: SubKey) => {
    setPending((p) => {
      if (key === 'price') {
        return { ...p, priceRange: [0, filters?.priceRange.max ?? 100] };
      }
      return { ...p, [key]: '' };
    });
  };

  const rows: { key: SubKey; label: string }[] = [
    { key: 'availability', label: 'Availability' },
    { key: 'price', label: 'Price' },
    { key: 'category', label: 'Category' },
  ];

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === pending.sort)?.label ?? 'Featured';

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 bg-[rgba(0,0,0,0.45)] transition-opacity duration-[320ms] ease-in-out z-[1000] ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filter and sort"
        className={`mfd-drawer fixed top-0 right-0 bottom-0 w-[min(400px,100vw)] bg-[#fff] transition-transform duration-[340ms] ease-in-out z-[1001] flex flex-col overflow-hidden ${
          open ? 'translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.18)]' : 'translate-x-full shadow-none'
        }`}
      >
        <div className="relative pt-[14px] px-[20px] pb-[12px] border-b border-solid border-[#eee] text-center flex-[0_0_auto]">
          <h2 className="text-[16px] font-semibold text-[#222]">Filter and sort</h2>
          <p className="text-[13px] text-[#666] mt-[2px]">{productCount} products</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-[14px] right-[18px] bg-transparent border-none cursor-pointer text-[#222] p-[4px] inline-flex items-center justify-center"
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div
            className={`flex w-[200%] h-full transition-transform duration-[340ms] ease-in-out ${
              view === 'main' ? 'translate-x-0' : '-translate-x-1/2'
            }`}
          >
            <div className="w-1/2 flex flex-col overflow-hidden">
              <nav className="py-[2px] px-0 flex-1 min-h-0 overflow-hidden">
                {rows.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setView(key)}
                    className="mfd-row w-full flex items-center justify-between py-[12px] px-[20px] bg-transparent border-none cursor-pointer text-[15px] text-[#222] text-left border-b border-solid border-[#f0f0f0] transition-colors duration-[160ms] ease-in-out"
                  >
                    {label}
                    <IconArrow size={14} />
                  </button>
                ))}

                <div className="pt-[14px] px-[20px] pb-[12px] border-b border-solid border-[#f0f0f0]">
                  <div className="flex items-center justify-between gap-[12px]">
                    <span className="text-[13px] font-bold tracking-[0.5px] text-[#222]">SORT BY</span>
                    <button
                      type="button"
                      onClick={() => setSortOpen((v) => !v)}
                      aria-expanded={sortOpen}
                      className={`inline-flex items-center gap-[6px] bg-transparent border border-solid py-[8px] px-[12px] rounded-[4px] cursor-pointer text-[15px] text-[#222] transition-colors duration-[220ms] ease-in-out ${
                        sortOpen ? 'border-[#222]' : 'border-transparent'
                      }`}
                    >
                      {activeSortLabel}
                      <span className={`transition-transform duration-[260ms] ease-in-out inline-flex ${sortOpen ? 'rotate-180' : ''}`}>
                        <IconChevronDown size={14} />
                      </span>
                    </button>
                  </div>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-[320ms] ease-in-out ${
                      sortOpen ? 'grid-rows-[1fr] opacity-100 mt-[10px]' : 'grid-rows-[0fr] opacity-0 mt-0'
                    }`}
                  >
                    <div className="overflow-hidden flex justify-end">
                      <div className="w-[240px] max-w-full border border-solid border-[#222] rounded-[2px] bg-[#fff]">
                        {SORT_OPTIONS.map((o) => {
                          const active = pending.sort === o.value;
                          return (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => {
                                setPending((p) => ({ ...p, sort: o.value }));
                                setSortOpen(false);
                              }}
                              className={`block w-full py-[6px] px-[12px] border-none text-left cursor-pointer text-[13px] leading-[1.4] transition-colors duration-[180ms] ease-in-out ${
                                active ? 'bg-[#2546f0] text-[#fff]' : 'bg-[#fff] text-[#222]'
                              }`}
                            >
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              <div className="flex items-center justify-between gap-[16px] py-[12px] px-[20px] border-t border-solid border-[#eee] bg-[#fff] flex-[0_0_auto]">
                <button type="button" onClick={handleRemoveAll} className="text-[14px] text-[#222] bg-transparent border-none cursor-pointer underline underline-offset-[3px] font-medium">
                  Remove all
                </button>
                <button type="button" onClick={handleApply} className="mfd-apply-btn">
                  Apply
                </button>
              </div>
            </div>

            <div className="w-1/2 flex flex-col overflow-hidden">
              <div className="flex-1 py-[14px] px-[20px] overflow-hidden min-h-0">
                <button
                  type="button"
                  onClick={() => setView('main')}
                  aria-label="Back to filters"
                  className="inline-flex items-center gap-[10px] bg-transparent border-none cursor-pointer text-[16px] text-[#222] font-medium mb-[20px] p-0"
                >
                  <IconArrow size={14} flip />
                  {view !== 'main' && view.charAt(0).toUpperCase() + view.slice(1)}
                </button>

                {filters && view === 'availability' && (
                  <div>
                    {([
                      { label: 'In stock', value: 'in-stock', count: filters.availability?.inStock ?? filters.categories.reduce((s, c) => s + c.count, 0) },
                      { label: 'Out of stock', value: 'out-of-stock', count: filters.availability?.outOfStock ?? 0 },
                    ]).map((o) => (
                      <FilterCheckbox
                        key={o.value}
                        label={o.label}
                        count={o.count}
                        checked={pending.availability === o.value}
                        onChange={() => setPending((p) => ({ ...p, availability: p.availability === o.value ? '' : o.value }))}
                      />
                    ))}
                  </div>
                )}

                {filters && view === 'price' && (
                  <PriceRangeSlider
                    min={0}
                    max={filters.priceRange.max}
                    value={pending.priceRange}
                    onChange={(r) => setPending((p) => ({ ...p, priceRange: r }))}
                    accentColor={theme?.accentColor}
                    mutedColor={theme?.mutedColor}
                    textColor={theme?.textColor}
                  />
                )}

                {filters && view === 'category' && (
                  <div>
                    <p className="text-[13px] font-semibold text-[#222] mb-[8px] uppercase tracking-[0.5px]">
                      Categories
                    </p>
                    {filters.categories.map((c) => {
                      const isSelected = pending.category === c.name;
                      return (
                        <FilterRadio
                          key={c.name}
                          label={c.name}
                          count={c.count}
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setPending((p) => ({ ...p, category: '', subcategory: '' }));
                            } else {
                              setPending((p) => ({ ...p, category: c.name, subcategory: '' }));
                            }
                          }}
                        />
                      );
                    })}

                    {pending.category && (
                      <div className="mt-[16px] pt-[16px] border-t border-dashed border-[#e0e0e0]">
                        <p className="text-[13px] font-semibold text-[#222] mb-[8px] uppercase tracking-[0.5px]">
                          Subcategories ({pending.category})
                        </p>
                        {(() => {
                          const categorySubs = filters.categorySubcategories?.[pending.category] || [];
                          const activeSubs = pending.subcategory
                            ? pending.subcategory.split(',').map((s) => s.trim()).filter(Boolean)
                            : [];

                          if (categorySubs.length === 0) {
                            return (
                              <p className="text-[13px] text-[#666] italic my-[4px] mx-0">
                                No subcategories available.
                              </p>
                            );
                          }

                          return categorySubs.map((sub) => {
                            const isChecked = activeSubs.includes(sub.name);
                            return (
                              <FilterCheckbox
                                key={`mob-sub-${sub.name}`}
                                label={sub.name}
                                count={sub.count}
                                checked={isChecked}
                                onChange={() => {
                                  const updated = isChecked
                                    ? activeSubs.filter((s) => s !== sub.name)
                                    : [...activeSubs, sub.name];
                                  setPending((p) => ({ ...p, subcategory: updated.join(',') }));
                                }}
                              />
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                )}

              </div>

              <div className="flex items-center justify-between gap-[16px] py-[12px] px-[20px] border-t border-solid border-[#eee] bg-[#fff] flex-[0_0_auto]">
                <button type="button" onClick={() => view !== 'main' && handleClearSub(view)} className="text-[14px] text-[#222] bg-transparent border-none cursor-pointer underline underline-offset-[3px] font-medium">
                  Clear
                </button>
                <button type="button" onClick={() => setView('main')} className="mfd-apply-btn">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        
        .mfd-row:hover { background-color: #f9f9f9; }
        .mfd-apply-btn {
          min-width: 140px;
          padding: 13px 28px;
          background-color: #000;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: background-color 220ms ease;
        }
        .mfd-apply-btn:hover { background-color: #F15B41; }
      `}</style>
    </>
  );
}

export { IconFilter };
