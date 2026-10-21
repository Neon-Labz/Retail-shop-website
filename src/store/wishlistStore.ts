'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  image2?: string;
  slug: string;
  badge: string | null;
  colors: { name: string; value: string }[];
  vendor: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: () => Promise<void>;
}

const syncToServer = async (items: WishlistItem[]) => {
  try {
    if (typeof window === 'undefined') return;
    const user = useAuthStore.getState().user;
    if (!user?.id) return;
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, items }),
    });
  } catch (e) {
    console.error('Error syncing wishlist with server:', e);
  }
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) return state;
          const next = [...state.items, item];
          syncToServer(next);
          return { items: next };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const next = state.items.filter((i) => i.productId !== productId);
          syncToServer(next);
          return { items: next };
        });
      },

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (productId: string) => get().items.some((i) => i.productId === productId),

      clearWishlist: () => {
        set({ items: [] });
        syncToServer([]);
      },

      syncWithServer: async () => {
        try {
          if (typeof window === 'undefined') return;
          const user = useAuthStore.getState().user;
          if (!user?.id) return;

          const res = await fetch(`/api/wishlist?userId=${user.id}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.wishlist)) {
            const current = get().items;
            const map = new Map<string, WishlistItem>();
            data.wishlist.forEach((item: any) => map.set(item.productId, item));
            current.forEach((item) => map.set(item.productId, item));
            const merged = Array.from(map.values());
            set({ items: merged });

            // If there were local items not yet on the server, push merged back
            if (merged.length !== data.wishlist.length) {
              syncToServer(merged);
            }
          }
        } catch (e) {
          console.error('Error hydrating wishlist from server:', e);
        }
      },
    }),
    {
      name: 'ambaz-wishlist',
    }
  )
);
