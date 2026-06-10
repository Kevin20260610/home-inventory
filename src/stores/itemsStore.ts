import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item } from '../types';
import { initialItems } from '../data/initialData';
import { nanoid } from 'nanoid';

interface ItemsState {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => Item | undefined;
}

export const useItemsStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      items: initialItems,

      addItem: (itemData) => {
        const now = new Date().toISOString();
        const newItem: Item = {
          ...itemData,
          id: `item-${nanoid(8)}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      updateItem: (id, itemData) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...itemData, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: 'home-inventory-items',
    }
  )
);
