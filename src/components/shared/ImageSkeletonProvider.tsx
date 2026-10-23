'use client';

import { useEffect } from 'react';

/**
 * ImageSkeletonProvider
 * Automatically attaches a fluid skeleton shimmer to all loading images
 * across the entire application and fades them in smoothly when loaded.
 */
export function ImageSkeletonProvider() {
  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return;

    const processImage = (img: HTMLImageElement) => {
      // Don't re-process if already initialized
      if (img.dataset.skeletonAttached) return;
      img.dataset.skeletonAttached = 'true';

      // Skip 1x1 tracking pixels, hidden or data-noskeleton images
      if (
        img.dataset.noskeleton === 'true' ||
        img.getAttribute('width') === '1' ||
        img.getAttribute('height') === '1' ||
        img.classList.contains('no-skeleton')
      ) {
        return;
      }

      const parent = img.parentElement;

      const onImageLoaded = () => {
        img.classList.remove('img-skeleton-loading');
        img.classList.add('img-skeleton-loaded');
        if (parent) {
          parent.classList.remove('parent-skeleton-loading');
          parent.classList.add('parent-skeleton-loaded');
        }
      };

      // If the image is already cached and loaded by the browser
      if (img.complete && img.naturalWidth > 0) {
        onImageLoaded();
        return;
      }

      // Image is still loading -> apply skeleton classes
      img.classList.add('img-skeleton-loading');

      // If parent is a positioned container (like Next.js Image with fill)
      if (parent) {
        const computedStyle = window.getComputedStyle(parent);
        const isPositioned =
          computedStyle.position === 'relative' ||
          computedStyle.position === 'absolute' ||
          parent.classList.contains('relative') ||
          parent.classList.contains('fc-card-img-link') ||
          parent.classList.contains('aspect-square');

        if (isPositioned) {
          parent.classList.add('parent-skeleton-loading');
        }
      }

      // Attach event listeners for completion
      const handleLoad = () => {
        onImageLoaded();
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };

      const handleError = () => {
        // Remove skeleton on error so broken image or fallback shows
        onImageLoaded();
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };

      img.addEventListener('load', handleLoad, { once: true });
      img.addEventListener('error', handleError, { once: true });
    };

    // 1. Process all existing images on the page
    document.querySelectorAll('img').forEach((img) => processImage(img));

    // 2. Observe dynamically added images (drawers, modals, tab switching, sliders, filters)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLImageElement) {
              processImage(node);
            } else if (node instanceof HTMLElement) {
              const imgs = node.querySelectorAll('img');
              imgs.forEach((img) => processImage(img));
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 3. Global capture-phase load handler as a fallback
    const globalLoadCapture = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        e.target.classList.remove('img-skeleton-loading');
        e.target.classList.add('img-skeleton-loaded');
        if (e.target.parentElement) {
          e.target.parentElement.classList.remove('parent-skeleton-loading');
          e.target.parentElement.classList.add('parent-skeleton-loaded');
        }
      }
    };
    window.addEventListener('load', globalLoadCapture, true);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', globalLoadCapture, true);
    };
  }, []);

  return null;
}
