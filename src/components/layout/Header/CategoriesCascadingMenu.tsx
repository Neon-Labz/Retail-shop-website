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
  align?: 'left' | 'center';
}

/* Original function signature commented out:
export function CategoriesCascadingMenu({ onClose }: CategoriesCascadingMenuProps) {
*/
export function CategoriesCascadingMenu({ onClose, align = 'left' }: CategoriesCascadingMenuProps) {
  const [categoriesList, setCategoriesList] = useState<CategoryTreeItem[]>([]);
  // const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    /* Original fetch commented out:
    fetch('/api/categories')
      .then((r) => r.json())
    */
    fetch('/api/categories')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.categories && Array.isArray(data.categories)) {
          /* Original unfiltered category list commented out as requested:
          setCategoriesList(data.categories);
          */
          const excludedNames = ['electronics', 'home & kitchen', 'fashion', 'sports & outdoors', 'test'];
          const filtered = data.categories.filter(
            (c: CategoryTreeItem) => !excludedNames.includes(c.name.trim().toLowerCase())
          );
          setCategoriesList(filtered);
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
        top: 'calc(100% + 8px)',
        /* Original center positioning commented out:
        left: '50%',
        transform: 'translateX(-50%)',
        */
        left: align === 'center' ? '50%' : '0',
        transform: align === 'center' ? 'translateX(-50%)' : 'none',
        width: '230px',
        minHeight: '200px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        /* Original conditional borderRadius commented out as requested:
        borderRadius: activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 ? '8px 0 0 8px' : '8px',
        */
        borderRadius: '8px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        /* Original animation commented out:
        animation: 'menuSlideDown 200ms ease-out',
        */
        animation: align === 'center' ? 'menuSlideCenter 180ms ease-out' : 'menuSlideLeft 180ms ease-out',
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
                  position: 'relative',
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

                {/* Subcategories Flyout aligned directly beside hovered category */}
                {isHovered && hasSubs && (
                  <div
                    className="cat-flyout-subpanel"
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '100%',
                      width: '240px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 28px rgba(0, 0, 0, 0.12)',
                      padding: '12px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      zIndex: 351,
                      animation: 'flyoutSlideRight 150ms ease-out',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {cat.subcategories.map((sub) => (
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
            );
          })}

          {/* Original full-height standalone subcategories flyout commented out as requested so subcategories appear directly beside the hovered category:
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
          */}
        </div>
      )}

      {/* 
        // Previous 2-column side-by-side layout preserved as requested:
        // <div style={{ width: '230px' }}>...</div>
        // <div style={{ flex: 1 }}>...</div>
      */}

      <style jsx>{`
        /* Original menuSlideDown with hardcoded translate(-50%) commented out to prevent jumping:
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
        */
        @keyframes menuSlideLeft {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes menuSlideCenter {
          from {
            opacity: 0;
            transform: translate(-50%, -6px);
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
