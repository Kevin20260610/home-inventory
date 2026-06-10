import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '../types';
import { initialCategories } from '../data/initialData';
import { nanoid } from 'nanoid';

interface CategoriesState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: initialCategories,

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: `cat-${nanoid(8)}`,
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },

      updateCategory: (id, categoryData) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...categoryData } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      getCategoryById: (id) => {
        return get().categories.find((category) => category.id === id);
      },
    }),
    {
      name: 'home-inventory-categories',
    }
  )
);
