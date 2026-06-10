import { Category, Location, Item } from '../types';

export const initialCategories: Category[] = [
  { id: 'cat-1', name: '电器', icon: 'tv', color: '#4A7C59' },
  { id: 'cat-2', name: '衣物', icon: 'shirt', color: '#E8A87C' },
  { id: 'cat-3', name: '书籍', icon: 'book-open', color: '#C38D9E' },
  { id: 'cat-4', name: '食品', icon: 'apple', color: '#85DCBA' },
  { id: 'cat-5', name: '工具', icon: 'wrench', color: '#F0A500' },
  { id: 'cat-6', name: '清洁用品', icon: 'sparkles', color: '#00B4D8' },
  { id: 'cat-7', name: '文件', icon: 'file-text', color: '#90BE6D' },
  { id: 'cat-8', name: '其他', icon: 'box', color: '#9B9B9B' },
];

export const initialLocations: Location[] = [
  // Houses
  { id: 'house-1', name: '自住房', parentId: undefined, type: 'house', color: '#4A7C59' },
  { id: 'house-2', name: '出租房', parentId: undefined, type: 'house', color: '#E8A87C' },

  // Rooms under 自住房
  { id: 'loc-1', name: '客厅', parentId: 'house-1', type: 'room', color: '#4A7C59' },
  { id: 'loc-2', name: '卧室', parentId: 'house-1', type: 'room', color: '#E8A87C' },
  { id: 'loc-3', name: '厨房', parentId: 'house-1', type: 'room', color: '#C38D9E' },
  { id: 'loc-4', name: '书房', parentId: 'house-1', type: 'room', color: '#90BE6D' },

  // Rooms under 出租房
  { id: 'loc-5', name: '客厅', parentId: 'house-2', type: 'room', color: '#4A7C59' },
  { id: 'loc-6', name: '卧室', parentId: 'house-2', type: 'room', color: '#E8A87C' },

  // Furniture
  { id: 'loc-7', name: '电视柜', parentId: 'loc-1', type: 'cabinet', color: '#4A7C59' },
  { id: 'loc-8', name: '衣柜', parentId: 'loc-2', type: 'cabinet', color: '#E8A87C' },
  { id: 'loc-9', name: '书柜', parentId: 'loc-4', type: 'cabinet', color: '#90BE6D' },
  { id: 'loc-10', name: '厨房抽屉', parentId: 'loc-3', type: 'drawer', color: '#C38D9E' },
];

export const initialItems: Item[] = [
  {
    id: 'item-1',
    name: '智能遥控器',
    description: '小米智能遥控器，可控制电视、空调等家电',
    categoryId: 'cat-1',
    locationId: 'loc-7',
    quantity: 1,
    imageUrl: '',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'item-2',
    name: '冬季羽绒服',
    description: '黑色中长款羽绒服，L码',
    categoryId: 'cat-2',
    locationId: 'loc-8',
    quantity: 2,
    imageUrl: '',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
  },
  {
    id: 'item-3',
    name: '设计模式书籍',
    description: '《Head First设计模式》中文版',
    categoryId: 'cat-3',
    locationId: 'loc-9',
    quantity: 1,
    imageUrl: '',
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
  },
  {
    id: 'item-4',
    name: '螺丝刀套装',
    description: '得力10件套螺丝刀套装',
    categoryId: 'cat-5',
    locationId: 'loc-10',
    quantity: 1,
    imageUrl: '',
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z',
  },
];
