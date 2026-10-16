'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  subcategories: string[];
}

interface CategoriesCascadingMenuProps {
  onClose?: () => void;
}

export function CategoriesCascadingMenu({ onClose }: CategoriesCascadingMenuProps) {
  const [categoriesList, setCategoriesList] = useState<CategoryTreeItem[]>([]);
  // const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.categories && Array.isArray(data.categories)) {
          setCategoriesList(data.categories);
          // Initial selection commented out so menu opens showing ONLY main categories first:
          // if (data.categories.length > 0) {
          //   setActiveCategoryId(data.categories[0].id);
          // }
        }
      })
      .catch((err) => {
        console.error('Error fetching categories from MongoDB:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategory = categoriesList.find((c) => c.id === hoveredCategoryId);

  return (
    <div
      className="cat-cascading-menu"
      onMouseLeave={() => setHoveredCategoryId(null)}
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '230px',
        minHeight: '200px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 ? '8px 0 0 8px' : '8px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        zIndex: 350,
        overflow: 'visible',
        animation: 'menuSlideDown 200ms ease-out',
      }}
    >
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '200px',
            fontSize: '14px',
            color: '#888',
            fontStyle: 'italic',
          }}
        >
          Loading categories...
        </div>
      ) : categoriesList.length === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '200px',
            fontSize: '14px',
            color: '#888',
          }}
        >
          No categories found in database.
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            padding: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* ── Main Categories Column (Pure Text, Live from MongoDB) ── */}
          {categoriesList.map((cat) => {
            const isHovered = cat.id === hoveredCategoryId;
            const hasSubs = cat.subcategories && cat.subcategories.length > 0;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCategoryId(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 20px',
                  cursor: 'pointer',
                  backgroundColor: isHovered ? '#f8f9fa' : 'transparent',
                  transition: 'background-color 150ms ease',
                }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  onClick={onClose}
                  style={{
                    fontSize: '15px',
                    fontWeight: isHovered ? 600 : 500,
                    color: isHovered ? '#F15B41' : '#222',
                    textDecoration: 'none',
                    flex: 1,
                    transition: 'color 150ms ease',
                  }}
                >
                  {cat.name}
                </Link>
                {hasSubs && (
                  <span
                    style={{
                      fontSize: '14px',
                      color: isHovered ? '#F15B41' : '#bbb',
                      fontWeight: 600,
                      paddingLeft: '8px',
                      transition: 'color 150ms ease',
                    }}
                  >
                    ›
                  </span>
                )}
              </div>
            );
          })}

          {/* ── Subcategories Flyout (Pure Text, Only shows when mouse hovers a category) ── */}
          {activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
            <div
              className="cat-flyout-subpanel"
              style={{
                position: 'absolute',
                top: '-11px',
                left: '100%',
                width: '250px',
                minHeight: 'calc(100% + 22px)',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0 8px 8px 0',
                boxShadow: '10px 12px 32px rgba(0, 0, 0, 0.08)',
                padding: '12px 20px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 351,
                animation: 'flyoutSlideRight 150ms ease-out',
              }}
            >
              {/* Heading removed/commented out as requested
              <div
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#888',
                  letterSpacing: '0.6px',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #eaeaea',
                }}
              >
                {activeCategory.name} Subcategories
              </div>
              */}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {activeCategory.subcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/shop?subcategory=${encodeURIComponent(sub)}`}
                    onClick={onClose}
                    className="cat-sub-link"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#333',
                      textDecoration: 'none',
                      padding: '4px 0',
                      transition: 'color 150ms ease, transform 150ms ease',
                      display: 'block',
                    }}
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 
        // Previous 2-column side-by-side layout preserved as requested:
        // <div style={{ width: '230px' }}>...</div>
        // <div style={{ flex: 1 }}>...</div>
      */}

      <style jsx>{`
        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes flyoutSlideRight {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        :global(.cat-sub-link:hover) {
          color: #F15B41 !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}

export default CategoriesCascadingMenu;
