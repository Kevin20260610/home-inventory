export interface Item {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  locationId: string;
  quantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  parentId: string | undefined;
  type: 'house' | 'room' | 'cabinet' | 'drawer' | 'shelf' | 'box';
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type LocationType = 'house' | 'room' | 'cabinet' | 'drawer' | 'shelf' | 'box';
