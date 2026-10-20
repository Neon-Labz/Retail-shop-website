'use client';

import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import { GroceryProductCard } from '@/features/grocery-shop/components/GroceryProductCard';
import { FeaturedSlider, type FeaturedCardTheme } from '@/features/home/components/FeaturedSlider';
import { MobileFilterDrawer, IconFilter } from './MobileFilterDrawer';
import { PriceRangeSlider } from './PriceRangeSlider';
import { GroceryFeaturedSlider } from '@/features/grocery-shop/components/GroceryFeaturedSlider';
import { GroceryShopFAQ } from '@/features/grocery-shop/components/GroceryShopFAQ';
import { SORT_OPTIONS, PRODUCTS_PER_PAGE } from '@/lib/constants';
import type { FiltersData } from '@/types/common';
import type { Product } from '@/types/product';

/* ── Icons ── */

/* 2-col icon */
function IconCol2() {
  return (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.5 12.5" width="12" height="14">
      <path d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z" fillRule="evenodd" />
      <path d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z" fillRule="evenodd" />
    </svg>
  );
}

/* 3-col icon */
function IconCol3() {
  return (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.5 12.5" width="14" height="14">
      <path d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z" fillRule="evenodd" />
      <path d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z" fillRule="evenodd" />
      <path d="M8.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 018.75 0z" fillRule="evenodd" />
    </svg>
  );
}

/* 4-col icon */
function IconCol4() {
  return (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.5 12.5" width="16" height="14">
      <path d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z" fillRule="evenodd" />
      <path d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z" fillRule="evenodd" />
      <path d="M8.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 018.75 0z" fillRule="evenodd" />
      <path d="M12.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 0112.75 0z" fillRule="evenodd" />
    </svg>
  );
}

/* Sort icon */
function IconSort() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" width="16" height="10" fill="currentColor">
      <path d="m0 0h16v2h-16zm0 4h12v2h-12zm0 4h8v2h-8z" />
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

/* ── Shop theme ── */

export interface ShopPageTheme {
  headerBg: string;
  toolbarBg: string;
  sidebarBg: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  accentColor: string;
  inputBg: string;
  tagBg: string;
}

const DEFAULT_THEME: ShopPageTheme = {
  headerBg: 'rgb(247, 248, 252)',
  toolbarBg: 'rgb(247, 248, 252)',
  sidebarBg: 'rgb(247, 248, 252)',
  textColor: '#222',
  mutedColor: '#555',
  borderColor: '#e5e5e5',
  accentColor: '#222',
  inputBg: '#fff',
  tagBg: '#fff',
};

const ShopThemeCtx = createContext<ShopPageTheme>(DEFAULT_THEME);

/* ── Filter Group ── */

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const theme = useContext(ShopThemeCtx);
  return (
    <div style={{ borderBottom: `1px solid ${theme.borderColor}`, paddingBottom: '20px', marginBottom: '20px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-group-title"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', fontWeight: 700, color: theme.textColor, padding: '0 0 4px' }}
      >
        {title}
        <span style={{ transition: 'transform 300ms ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-flex' }}>
          <IconChevronDown size={14} />
        </span>
      </button>
      {isOpen && <div style={{ paddingTop: '14px' }}>{children}</div>}
    </div>
  );
}

/* ── Custom Checkbox ── */

function FilterCheckbox({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  const theme = useContext(ShopThemeCtx);
  return (
    <label className="filter-checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 0', fontSize: '14px', color: theme.mutedColor }}>
      <span
        className="filter-cb"
        style={{
          width: '20px', height: '20px', borderRadius: '3px', flexShrink: 0,
          border: checked ? `2px solid ${theme.accentColor}` : `2px solid ${theme.borderColor}`,
          backgroundColor: checked ? theme.accentColor : theme.inputBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 200ms ease',
        }}
      >
        {checked && (
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M1.5 3.5L2.83333 4.75L4.16667 6L9.5 1" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>{label}</span>
      {count !== undefined && <span style={{ color: theme.borderColor, marginLeft: 'auto', fontSize: '15px' }}>{count}</span>}
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    </label>
  );
}

/* ── Custom Radio ── */

function FilterRadio({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  const theme = useContext(ShopThemeCtx);
  return (
    <label
      className="filter-radio-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        padding: '6px 0',
        fontSize: '14px',
        color: checked ? theme.textColor : theme.mutedColor,
        fontWeight: checked ? 600 : 400,
        transition: 'color 200ms ease',
      }}
      onClick={(e) => {
        e.preventDefault();
        onChange();
      }}
    >
      <span
        className="filter-rb"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          flexShrink: 0,
          border: checked ? `2px solid ${theme.accentColor}` : `2px solid ${theme.borderColor}`,
          backgroundColor: theme.inputBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms ease',
        }}
      >
        {checked && (
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: theme.accentColor,
            }}
          />
        )}
      </span>
      <span>{label}</span>
      {count !== undefined && <span style={{ color: theme.borderColor, marginLeft: 'auto', fontSize: '15px' }}>{count}</span>}
    </label>
  );
}

/* ── Filter Sidebar ── */

/* ── Active Filter Tag ── */

function IconCloseSmall() {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.48627 9.32917L2.82849 3.67098" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.88539 9.38504L8.42932 3.61524" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  const theme = useContext(ShopThemeCtx);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', color: theme.mutedColor, border: `1px solid ${theme.borderColor}`, borderRadius: '40px', backgroundColor: theme.tagBg, marginBottom: '8px', marginRight: '8px' }}>
      {label}
      <button className="filter-tag-remove" onClick={onRemove} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: theme.mutedColor, padding: 0 }}>
        <IconCloseSmall />
      </button>
    </span>
  );
}

/* ── Filter Sidebar ── */

/* Original FilterSidebar commented out as requested
function FilterSidebarOriginal({ filters, selectedFilters, onFilterChange, priceRange, onPriceChange, onRemoveAll }: {
  filters: FiltersData | undefined;
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onRemoveAll: () => void;
}) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const theme = useContext(ShopThemeCtx);
  if (!filters) return null;
  return null;
}
*/

function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onBatchFilterChange,
  priceRange,
  onPriceChange,
  onRemoveAll,
}: {
  filters: FiltersData | undefined;
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onBatchFilterChange?: (updates: Record<string, string>) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onRemoveAll: () => void;
}) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const theme = useContext(ShopThemeCtx);

  if (!filters) return null;

  const hasActiveFilters =
    Object.values(selectedFilters).some((v) => v !== '') ||
    /* priceRange[0] > filters.priceRange.min || commented out as requested */
    priceRange[0] > 0 ||
    priceRange[1] < filters.priceRange.max;

  // Active selected subcategories array from comma-separated string
  const activeSubcategories = selectedFilters.subcategory
    ? selectedFilters.subcategory
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const activeFilterTags: { label: string; key: string }[] = [];
  /* if (priceRange[0] > filters.priceRange.min || priceRange[1] < filters.priceRange.max) { commented out as requested */
  if (priceRange[0] > 0 || priceRange[1] < filters.priceRange.max) {
    activeFilterTags.push({
      label: `LKR ${priceRange[0].toLocaleString('en-US')} – LKR ${priceRange[1].toLocaleString('en-US')}`,
      key: 'price',
    });
  }
  if (selectedFilters.availability) {
    activeFilterTags.push({ label: `Availability: ${selectedFilters.availability}`, key: 'availability' });
  }
  if (selectedFilters.category) {
    activeFilterTags.push({ label: `Category: ${selectedFilters.category}`, key: 'category' });
  }
  activeSubcategories.forEach((sub) => {
    activeFilterTags.push({ label: `Subcategory: ${sub}`, key: `sub:${sub}` });
  });

  return (
    <div style={{ backgroundColor: theme.sidebarBg, borderRadius: '8px', padding: '28px', overflow: 'hidden' }}>
      {/* Header with Remove all */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 className="filter-group-title" style={{ fontSize: '20px', fontWeight: 700, color: theme.textColor, margin: 0 }}>
          Filter:
        </h3>
        {hasActiveFilters && (
          <button
            className="filter-remove-all"
            onClick={onRemoveAll}
            style={{ fontSize: '14px', color: '#F15B41', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            Remove all
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {activeFilterTags.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap' }}>
          {activeFilterTags.map((tag) => (
            <FilterTag
              key={tag.key}
              label={tag.label}
              onRemove={() => {
                if (tag.key === 'price') {
                  /* onPriceChange([filters.priceRange.min, filters.priceRange.max]); commented out as requested */
                  onPriceChange([0, filters.priceRange.max]);
                } else if (tag.key === 'category') {
                  // Removing category also clears subcategories
                  if (onBatchFilterChange) onBatchFilterChange({ category: '', subcategory: '' });
                  else {
                    onFilterChange('category', '');
                    onFilterChange('subcategory', '');
                  }
                } else if (tag.key.startsWith('sub:')) {
                  const subToRemove = tag.key.slice(4);
                  const remaining = activeSubcategories.filter((s) => s !== subToRemove);
                  onFilterChange('subcategory', remaining.join(','));
                } else {
                  onFilterChange(tag.key, '');
                }
              }}
            />
          ))}
        </div>
      )}

      <FilterGroup title="Availability">
        {/* Original static/hardcoded availability counts commented out:
        <FilterCheckbox
          label="In stock"
          count={filters.categories.reduce((s, c) => s + c.count, 0)}
          checked={selectedFilters.availability === 'in-stock'}
          onChange={() => onFilterChange('availability', selectedFilters.availability === 'in-stock' ? '' : 'in-stock')}
        />
        <FilterCheckbox
          label="Out of stock"
          count={0}
          checked={selectedFilters.availability === 'out-of-stock'}
          onChange={() => onFilterChange('availability', selectedFilters.availability === 'out-of-stock' ? '' : 'out-of-stock')}
        />
        */}
        <FilterCheckbox
          label="In stock"
          count={filters.availability?.inStock ?? filters.categories.reduce((s, c) => s + c.count, 0)}
          checked={selectedFilters.availability === 'in-stock'}
          onChange={() => onFilterChange('availability', selectedFilters.availability === 'in-stock' ? '' : 'in-stock')}
        />
        <FilterCheckbox
          label="Out of stock"
          count={filters.availability?.outOfStock ?? 0}
          checked={selectedFilters.availability === 'out-of-stock'}
          onChange={() => onFilterChange('availability', selectedFilters.availability === 'out-of-stock' ? '' : 'out-of-stock')}
        />
      </FilterGroup>

      <FilterGroup title="Price">
        {/* Original min={filters.priceRange.min} commented out as requested
        <PriceRangeSlider
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          value={priceRange}
          onChange={onPriceChange}
          accentColor={theme.accentColor}
          mutedColor={theme.mutedColor}
          textColor={theme.textColor}
        />
        */}
        <PriceRangeSlider
          min={0}
          max={filters.priceRange.max}
          value={priceRange}
          onChange={onPriceChange}
          accentColor={theme.accentColor}
          mutedColor={theme.mutedColor}
          textColor={theme.textColor}
        />
      </FilterGroup>

      <FilterGroup title="More filters">
        {/* Dynamic MongoDB Categories filter (Radio Group: Single Selection) */}
        {filters.categories && filters.categories.length > 0 && (
          <div style={{ marginBottom: selectedFilters.category ? '20px' : '0' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: theme.textColor,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Categories
            </p>
            {filters.categories.map((c) => {
              const isSelected = selectedFilters.category === c.name;
              return (
                <FilterRadio
                  key={`cat-${c.name}`}
                  label={c.name}
                  count={c.count}
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      // Clicking currently selected category unselects it and clears subcategory
                      if (onBatchFilterChange) onBatchFilterChange({ category: '', subcategory: '' });
                      else {
                        onFilterChange('category', '');
                        onFilterChange('subcategory', '');
                      }
                    } else {
                      // Selecting a new category sets category and resets subcategories
                      if (onBatchFilterChange) onBatchFilterChange({ category: c.name, subcategory: '' });
                      else {
                        onFilterChange('category', c.name);
                        onFilterChange('subcategory', '');
                      }
                    }
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Dynamic MongoDB Subcategories filter (Visible ONLY when a category is selected) */}
        {selectedFilters.category && (
          <div style={{ paddingTop: '16px', borderTop: `1px dashed ${theme.borderColor}` }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: theme.textColor,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Subcategories ({selectedFilters.category})
            </p>
            {(() => {
              // Retrieve specific subcategories for the selected category from MongoDB filters
              const categorySubs = filters.categorySubcategories?.[selectedFilters.category] || [];

              if (categorySubs.length === 0) {
                return (
                  <p style={{ fontSize: '13px', color: theme.mutedColor, fontStyle: 'italic', margin: '6px 0' }}>
                    No subcategories available.
                  </p>
                );
              }

              const visibleSubs = showMoreFilters ? categorySubs : categorySubs.slice(0, 8);

              return (
                <>
                  {visibleSubs.map((sub) => {
                    const isChecked = activeSubcategories.includes(sub.name);
                    return (
                      <FilterCheckbox
                        key={`sub-${sub.name}`}
                        label={sub.name}
                        count={sub.count}
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? activeSubcategories.filter((s) => s !== sub.name)
                            : [...activeSubcategories, sub.name];
                          onFilterChange('subcategory', updated.join(','));
                        }}
                      />
                    );
                  })}
                  {categorySubs.length > 8 && (
                    <button
                      onClick={() => setShowMoreFilters(!showMoreFilters)}
                      className="filter-show-more"
                      style={{
                        fontSize: '14px',
                        color: theme.textColor,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '8px',
                        fontWeight: 500,
                      }}
                    >
                      {showMoreFilters ? '- Show less' : '+ Show more'}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </FilterGroup>

      {/* Brand filter commented out as requested
      <FilterGroup title="Brand">
        {(showMoreBrand ? filters.brands : filters.brands.slice(0, 10)).map((b) => (
          <FilterCheckbox key={`br-${b.name}`} label={b.name} count={b.count} checked={selectedFilters.brand === b.name} onChange={() => onFilterChange('brand', selectedFilters.brand === b.name ? '' : b.name)} />
        ))}
        {filters.brands.length > 10 && (
          <button onClick={() => setShowMoreBrand(!showMoreBrand)} className="filter-show-more" style={{ fontSize: '14px', color: theme.textColor, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
            {showMoreBrand ? '- Show less' : '+ Show more'}
          </button>
        )}
      </FilterGroup>
      */}

      {/* Color filter commented out as requested
      <FilterGroup title="Color">
        {(showMoreColor ? filters.colors : filters.colors.slice(0, 8)).map((c) => (
          <FilterCheckbox key={c.name} label={c.name} count={c.count} checked={selectedFilters.color === c.name} onChange={() => onFilterChange('color', selectedFilters.color === c.name ? '' : c.name)} />
        ))}
        {filters.colors.length > 8 && (
          <button onClick={() => setShowMoreColor(!showMoreColor)} className="filter-show-more" style={{ fontSize: '14px', color: theme.textColor, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
            {showMoreColor ? '- Show less' : '+ Show more'}
          </button>
        )}
      </FilterGroup>
      */}

      {/* Size filter commented out as requested
      <FilterGroup title="Size">
        {(showMoreSize ? filters.sizes : filters.sizes.slice(0, 8)).map((s) => (
          <FilterCheckbox key={s.name} label={s.name} count={s.count} checked={selectedFilters.size === s.name} onChange={() => onFilterChange('size', selectedFilters.size === s.name ? '' : s.name)} />
        ))}
        {filters.sizes.length > 8 && (
          <button onClick={() => setShowMoreSize(!showMoreSize)} className="filter-show-more" style={{ fontSize: '14px', color: theme.textColor, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
            {showMoreSize ? '- Show less' : '+ Show more'}
          </button>
        )}
      </FilterGroup>
      */}
    </div>
  );
}

/* ── Pagination ── */

function ShopPagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const theme = useContext(ShopThemeCtx);

  // Build page numbers: 1, 2, 3, ..., totalPages
  const pages: (number | '...')[] = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3);
    if (currentPage > 4) pages.push('...');
    if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(currentPage);
    }
    if (currentPage < totalPages - 3) pages.push('...');
    pages.push(totalPages);
  }

  // Remove duplicates
  const unique: (number | '...')[] = [];
  pages.forEach((p) => {
    if (p === '...' && unique[unique.length - 1] === '...') return;
    if (typeof p === 'number' && unique.includes(p)) return;
    unique.push(p);
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '50px', paddingBottom: '10px' }}>
      {unique.map((p, i) => p === '...' ? (
        <span key={`dots-${i}`} style={{ fontSize: '16px', color: theme.mutedColor, letterSpacing: '2px' }}>...</span>
      ) : (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', border: 'none',
            fontSize: '16px', fontWeight: 500, cursor: 'pointer',
            backgroundColor: p === currentPage ? theme.accentColor : 'transparent',
            color: p === currentPage ? '#fff' : theme.textColor,
            transition: 'all 250ms ease',
          }}
          onMouseEnter={(e) => { if (p !== currentPage) { e.currentTarget.style.backgroundColor = theme.inputBg; } }}
          onMouseLeave={(e) => { if (p !== currentPage) { e.currentTarget.style.backgroundColor = 'transparent'; } }}
        >
          {p}
        </button>
      ))}

      {/* Next arrow */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: theme.textColor }}
          aria-label="Next page"
        >
          ›
        </button>
      )}
    </div>
  );
}

/* ── Skeleton ── */

function ProductSkeleton({ cardVariant = 'home' }: { cardVariant?: 'home' | 'grocery' }) {
  const aspect = cardVariant === 'grocery' ? '1/1' : '3/4';
  return (
    <div>
      <div className="animate-shimmer" style={{ aspectRatio: aspect, borderRadius: cardVariant === 'grocery' ? '10px' : '4px', marginBottom: '14px' }} />
      <div className="animate-shimmer" style={{ height: '16px', width: '70%', margin: '0 auto 8px', borderRadius: '4px' }} />
      <div className="animate-shimmer" style={{ height: '14px', width: '40%', margin: '0 auto 12px', borderRadius: '4px' }} />
      {cardVariant === 'grocery' && (
        <div className="animate-shimmer" style={{ height: '52px', width: '100%', borderRadius: '40px' }} />
      )}
    </div>
  );
}

/* ── Main Component ── */

interface ShopPageContentProps {
  /** Route base for URL sync (e.g. "/shop" or "/grocery/shop"). Default: "/shop". */
  basePath?: string;
  /** API endpoint for product listing. Default: "/api/products". */
  apiEndpoint?: string;
  /** Base href for linking to product detail pages (e.g. "/products" or "/grocery/product"). */
  productHrefBase?: string;
  /** Page header title. Default: "PRODUCTS". */
  title?: string;
  /** Home link label. Default: "Home". */
  homeLabel?: string;
  /** Home link href. Default: "/". */
  homeHref?: string;
  /** Breadcrumb label for the current page. Default: "Products". */
  breadcrumbLabel?: string;
  /** Which product card design to render. Default: "home" (fashion). Pass "grocery" for Grocery Shop. */
  cardVariant?: 'home' | 'grocery';
  /** Optional theming overrides forwarded to every HomeProductCard rendered on this page
      (the main grid and the "Featured Collection" slider below). Only applies when
      cardVariant === 'home'. Use this to re-theme the shop page for pet-food / nutrition
      so the cards match their respective homepage Featured Tab sections. */
  cardTheme?: FeaturedCardTheme;
  /** Per-storefront dark/light theme overrides (bg colors, text colors, accent). */
  shopTheme?: Partial<ShopPageTheme>;
  /** Custom card renderer — when provided, replaces the built-in HomeProductCard / GroceryProductCard. */
  renderCard?: (product: Product, index: number) => React.ReactNode;
}

export function ShopPageContent({
  basePath = '/shop',
  apiEndpoint = '/api/products',
  productHrefBase = '/products',
  title = 'PRODUCTS',
  homeLabel = 'Home',
  homeHref = '/',
  breadcrumbLabel = 'Products',
  cardVariant = 'home',
  cardTheme,
  shopTheme,
  renderCard,
}: ShopPageContentProps = {}) {
  const theme: ShopPageTheme = { ...DEFAULT_THEME, ...shopTheme };
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const [savedView, setSavedView] = useState<2 | 3 | 4>(4);
  useEffect(() => {
    const stored = localStorage.getItem('shop-view-cols');
    if (stored === '2' || stored === '3' || stored === '4') setSavedView(Number(stored) as 2 | 3 | 4);
  }, []);
  const viewCols: 2 | 3 | 4 = viewParam === '2' ? 2 : viewParam === '3' ? 3 : viewParam === '4' ? 4 : savedView;
  const [sortOpen, setSortOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const filterTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Track filter changes
  const prevFiltersRef = useRef('');
  const currentFilterKey = `${searchParams.toString()}`;

  /* Original artificial 1.5s filterLoading delay commented out as requested so filter options don't refresh / lock the page:
  useEffect(() => {
    if (prevFiltersRef.current && prevFiltersRef.current !== currentFilterKey) {
      setFilterLoading(true);
      if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
      filterTimerRef.current = setTimeout(() => setFilterLoading(false), 1500);
    }
    prevFiltersRef.current = currentFilterKey;
    return () => { if (filterTimerRef.current) clearTimeout(filterTimerRef.current); };
  }, [currentFilterKey]);
  */

  const setViewCols = useCallback((cols: 2 | 3 | 4) => {
    localStorage.setItem('shop-view-cols', String(cols));
    setSavedView(cols);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', String(cols));
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, basePath]);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'featured';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const collection = searchParams.get('collection') || '';
  const brand = searchParams.get('brand') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const availability = searchParams.get('availability') || '';
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
  // No hardcoded numeric ceiling here — storefronts' real max prices vary
  // wildly (e.g. $100 for grocery vs $890 for megastore), so a fixed
  // fallback like 550 either clips valid megastore prices or, worse,
  // overshoots the real max for cheaper storefronts and stretches the
  // slider's fill track past 100% on first load. `undefined` means "no
  // user-set ceiling" — the API applies no upper bound, and the slider's
  // displayed value falls back to the real fetched max (see displayMaxPrice).
  const maxPriceParam = searchParams.get('maxPrice');
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam) : undefined;

  const { data, isLoading } = useProducts({
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    sort,
    category: category || undefined,
    subcategory: subcategory || undefined,
    collection: collection || undefined,
    brand: brand || undefined,
    color: color || undefined,
    size: size || undefined,
    availability: availability || undefined,
    minPrice: minPrice || undefined,
    maxPrice,
  }, { endpoint: apiEndpoint });

  // The slider needs a concrete number to display even when the URL has no
  // maxPrice param — fall back to this storefront's actual fetched max
  // (not a magic constant), so the fill percentage is always <= 100%.
  const displayMaxPrice = maxPrice ?? data?.filters?.priceRange.max ?? 0;

  // Persist filter facets across renders so sidebar options never unmount or refresh
  const filtersDataRef = useRef(data?.filters);
  if (data?.filters) {
    filtersDataRef.current = data.filters;
  }

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!('page' in updates)) params.set('page', '1');
    /* Original router.push commented out as requested to prevent page reload feeling:
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
    */
    router.replace(`${basePath}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, basePath]);

  const handleFilterChange = (key: string, value: string) => updateParams({ [key]: value });
  /* Original handlePriceChange commented out as requested
  const handlePriceChange = useCallback((range: [number, number]) => {
    updateParams({ minPrice: String(range[0]), maxPrice: String(range[1]) });
  }, [updateParams]);
  */
  const handlePriceChange = useCallback((range: [number, number]) => {
    updateParams({
      minPrice: range[0] > 0 ? String(range[0]) : '',
      maxPrice: range[1] < (data?.filters?.priceRange.max ?? range[1]) ? String(range[1]) : '',
    });
  }, [updateParams, data?.filters?.priceRange.max]);
  const handlePageChange = (page: number) => {
    updateParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopThemeCtx.Provider value={theme}>
      {/* Page Header */}
      <div className="container-main" style={{ paddingTop: '30px' }}>
        <div style={{ backgroundColor: theme.headerBg, borderRadius: '10px', height: '120px', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: theme.textColor, marginBottom: '6px' }}>{title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <Link href={homeHref} style={{ color: theme.mutedColor, textDecoration: 'underline', textUnderlineOffset: '3px' }}>{homeLabel}</Link>
              <span style={{ color: '#bbb' }}>/</span>
              <span style={{ color: theme.textColor }}>{breadcrumbLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main">
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', backgroundColor: theme.toolbarBg, borderRadius: '0', padding: '0 20px', marginBottom: '30px', marginTop: '20px' }}>
          {/* Left: Desktop view toggles — hidden at <=749px */}
          <div className="shop-view-toggles" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {([
              { cols: 2 as const, Icon: IconCol2 },
              { cols: 3 as const, Icon: IconCol3 },
              { cols: 4 as const, Icon: IconCol4 },
            ]).map(({ cols, Icon }) => (
              <button
                key={cols}
                onClick={() => setViewCols(cols)}
                style={{
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid', borderColor: viewCols === cols ? theme.accentColor : theme.borderColor,
                  backgroundColor: viewCols === cols ? theme.accentColor : theme.inputBg,
                  color: viewCols === cols ? '#fff' : theme.mutedColor,
                  cursor: 'pointer', borderRadius: '4px', transition: 'all 200ms ease',
                }}
              >
                <Icon />
              </button>
            ))}
          </div>

          {/* Left: Mobile "Filter and sort" button — shown only at <=749px */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="shop-mobile-filter-btn"
            aria-label="Open filter and sort"
          >
            <IconFilter size={18} />
            <span>Filter and sort</span>
          </button>

          {/* Right: Sort + count (desktop).
              On mobile the Sort dropdown is hidden and only the count remains. */}
          <div className="shop-sort-group" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Sort By dropdown — hidden at <=749px via .shop-sort-dropdown */}
            <div className="shop-sort-dropdown" style={{ position: 'relative' }}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '15px', fontWeight: 600, color: theme.textColor, letterSpacing: '0.5px',
                }}
              >
                <IconSort />
                SORT BY
              </button>

              {sortOpen && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 28px)', right: 0,
                    minWidth: '260px', backgroundColor: theme.inputBg, border: `1px solid ${theme.borderColor}`,
                    borderRadius: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '10px 0', zIndex: 50,
                    animation: 'slideUp 200ms ease-out',
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <label
                      key={o.value}
                      className="sort-dropdown-item"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 20px',
                        fontSize: '15px', color: theme.textColor, cursor: 'pointer',
                      }}
                      onClick={() => { updateParams({ sort: o.value }); setSortOpen(false); }}
                    >
                      <span style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: sort === o.value ? `5px solid ${theme.accentColor}` : `2px solid ${theme.borderColor}`,
                        display: 'inline-block', transition: 'all 200ms ease',
                      }} />
                      {o.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Product count — hidden during loading, spinner shown instead */}
            <span style={{ fontSize: '15px', fontWeight: 500, color: theme.textColor, minWidth: '90px', textAlign: 'right', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {filterLoading ? (
                <span className="filter-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
              ) : (
                <span style={{ animation: 'filterFadeIn 400ms ease' }}>
                  {data?.pagination ? `${data.pagination.totalProducts} products` : ''}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Main content: Filter + Products */}
        <div className="shop-main-row" style={{ display: 'flex', gap: '40px', paddingBottom: '60px' }}>
          <div className="shop-sidebar" style={{ width: '290px', flexShrink: 0 }}>
            {/* Original FilterSidebar call commented out as requested
            <FilterSidebar
              filters={data?.filters}
              selectedFilters={{ category, brand, color, size, availability }}
              onFilterChange={handleFilterChange}
              priceRange={[minPrice, displayMaxPrice]}
              onPriceChange={handlePriceChange}
              onRemoveAll={() => {}}
            />
            */}
            {/* Original filters={data?.filters} commented out as requested; cached in ref so filter sidebar never disappears/refreshes while products update:
            <FilterSidebar
              filters={data?.filters}
              selectedFilters={{ category, subcategory, brand, color, size, availability }}
              onFilterChange={handleFilterChange}
              onBatchFilterChange={updateParams}
              priceRange={[minPrice, displayMaxPrice]}
              onPriceChange={handlePriceChange}
              onRemoveAll={() => {
                const params = new URLSearchParams();
                const view = searchParams.get('view');
                if (view) params.set('view', view);
                router.push(`${basePath}?${params.toString()}`, { scroll: false });
              }}
            />
            */}
            <FilterSidebar
              filters={data?.filters || filtersDataRef.current}
              selectedFilters={{ category, subcategory, brand, color, size, availability }}
              onFilterChange={handleFilterChange}
              onBatchFilterChange={updateParams}
              priceRange={[minPrice, displayMaxPrice]}
              onPriceChange={handlePriceChange}
              onRemoveAll={() => {
                const params = new URLSearchParams();
                const view = searchParams.get('view');
                if (view) params.set('view', view);
                router.replace(`${basePath}?${params.toString()}`, { scroll: false });
              }}
            />
          </div>

          {/* Product Grid */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Loading spinner — centered in grid area */}
            {filterLoading && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}>
                <div className="filter-spinner" />
              </div>
            )}

            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${viewCols}, 1fr)`, gap: '24px', opacity: filterLoading ? 0.15 : 1, transition: 'opacity 400ms ease', minHeight: filterLoading ? '400px' : 'auto' }}>
              {isLoading
                ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => <ProductSkeleton key={i} cardVariant={cardVariant} />)
                : data?.products.map((product, i) => (
                    renderCard ? (
                      <div key={product.id} style={{ minWidth: 0 }}>{renderCard(product, i)}</div>
                    ) : cardVariant === 'grocery' ? (
                      <GroceryProductCard key={product.id} product={product} index={i} hrefBase={productHrefBase} />
                    ) : (
                      <HomeProductCard
                        key={product.id}
                        product={product}
                        index={i}
                        hrefBase={productHrefBase}
                        {...cardTheme}
                      />
                    )
                  ))
              }
            </div>

            {!filterLoading && data?.pagination && (
              <ShopPagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* You may also like — same as homepage Featured Collection Slider */}
      <div style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        {cardVariant === 'grocery' ? (
          <GroceryFeaturedSlider />
        ) : (
          <FeaturedSlider
            apiEndpoint={apiEndpoint}
            cardVariant={cardVariant}
            productHrefBase={productHrefBase}
            cardTheme={cardTheme}
            count={apiEndpoint === '/api/megastore-products' ? 6 : undefined}
          />
        )}
      </div>

      {cardVariant === 'grocery' && <GroceryShopFAQ />}

      {/* Mobile Filter & Sort drawer — renders always but slides off-screen
          when closed. Only opened by the mobile toolbar button at <=749px. */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        /* Original filters={data?.filters} commented out as requested; cached in ref to avoid refresh/flicker:
        filters={data?.filters}
        */
        filters={data?.filters || filtersDataRef.current}
        selected={{ availability, brand, color, size, category, subcategory, sort }}
        priceRange={[minPrice, displayMaxPrice]}
        productCount={data?.pagination?.totalProducts ?? 0}
        theme={{ accentColor: theme.accentColor, mutedColor: theme.mutedColor, textColor: theme.textColor }}
        onApply={(payload) => {
          const updates: Record<string, string> = {
            availability: payload.availability,
            brand: payload.brand,
            color: payload.color,
            size: payload.size,
            category: payload.category,
            subcategory: payload.subcategory,
            sort: payload.sort === 'featured' ? '' : payload.sort,
            minPrice: payload.minPrice > 0 ? String(payload.minPrice) : '',
            maxPrice: payload.maxPrice < (data?.filters?.priceRange.max ?? payload.maxPrice) ? String(payload.maxPrice) : '',
          };
          updateParams(updates);
        }}
        onRemoveAll={() => {
          const params = new URLSearchParams();
          const view = searchParams.get('view');
          if (view) params.set('view', view);
          router.push(`${basePath}?${params.toString()}`, { scroll: false });
        }}
      />

      <style>{`
        /* ── Mobile filter toolbar ──
           The desktop toolbar has a 3-button view toggle on the left and a
           SORT BY dropdown on the right. At <=749px they are replaced with a
           single "Filter and sort" button on the left; the product count on
           the right stays. */
        .shop-mobile-filter-btn {
          display: none;
        }
        @media (max-width: 749px) {
          .shop-view-toggles { display: none !important; }
          .shop-sort-dropdown { display: none !important; }
          .shop-mobile-filter-btn {
            display: inline-flex;
            align-items: center;
            /* Fluid scaling across the mobile range — font/padding/gap all
               shrink gradually as viewport narrows, so the button never
               snaps to a smaller size and stays touch-friendly. */
            gap: clamp(5px, 1.6vw, 8px);
            padding: clamp(7px, 2.2vw, 10px) clamp(12px, 4vw, 18px);
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: clamp(12px, 3.5vw, 15px);
            font-weight: 500;
            color: #222;
            cursor: pointer;
            white-space: nowrap;
            transition: background-color 180ms ease, border-color 180ms ease;
          }
          .shop-mobile-filter-btn svg {
            width: clamp(14px, 4.2vw, 18px);
            height: auto;
          }
          .shop-mobile-filter-btn:hover {
            background-color: #f4f4f4;
            border-color: #c9c9c9;
          }
          .shop-sidebar { display: none !important; }
          .shop-main-row { gap: 0 !important; }
        }

        /* Responsive product grid overrides — these beat the inline
           gridTemplateColumns (set from the 2/3/4 view toggle) at tablet
           and mobile widths so the shop stays readable below 992px. */
        @media (max-width: 991px) {
          .shop-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 749px) {
          .shop-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }

        .sort-dropdown-item:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-group-title:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-checkbox-row:hover .filter-cb {
          border-color: #222 !important;
        }
        .filter-show-more:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-remove-all:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-tag-remove:hover {
          text-decoration: underline;
        }
        .filter-spinner {
          width: 24px;
          height: 24px;
          border: 2.5px solid #e0e0e0;
          border-top-color: #222;
          border-radius: 50%;
          animation: filterSpin 0.6s linear infinite;
        }
        @keyframes filterSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes filterFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </ShopThemeCtx.Provider>
  );
}
