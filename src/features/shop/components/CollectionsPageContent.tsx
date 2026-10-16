'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
/* Previous static categoriesData import commented out as requested
import categoriesData from '@/data/categories.json';
*/

interface MongoCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  productCount: number;
}

export function CollectionsPageContent() {
  const [categories, setCategories] = useState<MongoCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error('Error fetching live categories from MongoDB:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Page Header */}
      <div style={{ backgroundColor: 'rgb(247, 248, 252)', padding: '20px 0 40px', textAlign: 'center' }}>
        <div className="container-main">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
            <Link href="/" style={{ color: '#777', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Home</Link>
            <span style={{ color: '#bbb' }}>/</span>
            <span style={{ color: '#222' }}>Collections</span>
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 600, color: '#222' }}>Collections</h1>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container-main" style={{ paddingTop: '50px', paddingBottom: '80px' }}>
        {/* Previous 3-column fixed grid commented out as requested
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', rowGap: '40px' }}>
        */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', rowGap: '40px' }}>
        {/* Previous categoriesData mapping commented out as requested
        categoriesData.map((category) => (
        */}
        {loading && categories.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="animate-shimmer" style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '8px', marginBottom: '14px' }} />
                <div className="animate-shimmer" style={{ height: '18px', width: '60%', margin: '0 auto 8px', borderRadius: '4px' }} />
                <div className="animate-shimmer" style={{ height: '14px', width: '30%', margin: '0 auto', borderRadius: '4px' }} />
              </div>
            ))
          : categories.map((category) => (
          /* Previous collection query link commented out as requested
          <Link
            key={category.id}
            href={`/shop?collection=${category.slug}`}
            className="collection-card"
            style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}
          >
          */
          <Link
            key={category.id}
            href={`/shop?category=${encodeURIComponent(category.name)}`}
            className="collection-card"
            style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}
          >
            {/* Image */}
            {/* Previous 470px tall container commented out as requested
              <div
                className="collection-card-img-wrap"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '470px',
                  backgroundColor: '#f7f7f7',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="collection-card-img"
                  style={{ objectFit: 'contain', objectPosition: 'center', padding: '30px', transition: 'transform 400ms ease' }}
                  sizes="(max-width: 749px) 100vw, 33vw"
                />
              </div>
              */}
            <div
              className="collection-card-img-wrap"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="collection-card-img"
                style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 400ms ease' }}
                sizes="(max-width: 749px) 100vw, (max-width: 991px) 50vw, 33vw"
              />
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginBottom: '4px', marginTop: '16px', transition: 'color 200ms ease' }}>
              {category.name}
            </h3>

            {/* Count */}
            <p style={{ fontSize: '14px', color: '#888' }}>
              {category.productCount} Items
            </p>
          </Link>
        ))}
      </div>
    </div >

      <style>{`
        .collection-card:hover .collection-card-img {
          transform: scale(1.08);
        }
        .collection-card:hover h3 {
          color: #F15B41 !important;
        }
      `}</style>
    </>
  );
}
