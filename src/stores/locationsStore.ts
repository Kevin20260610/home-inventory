import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Location } from '../types';
import { initialLocations } from '../data/initialData';
import { nanoid } from 'nanoid';

interface LocationsState {
  locations: Location[];
  addLocation: (location: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  getLocationById: (id: string) => Location | undefined;
  getChildLocations: (parentId: string) => Location[];
  getRootLocations: () => Location[];
  getHouses: () => Location[];
  getRooms: (houseId: string) => Location[];
}

export const useLocationsStore = create<LocationsState>()(
  persist(
    (set, get) => ({
      locations: initialLocations,

      addLocation: (locationData) => {
        const prefix = locationData.type === 'house' ? 'house' : 'loc';
        const newLocation: Location = {
          ...locationData,
          id: `${prefix}-${nanoid(8)}`,
        };
        set((state) => ({ locations: [...state.locations, newLocation] }));
      },

      updateLocation: (id, locationData) => {
        set((state) => ({
          locations: state.locations.map((location) =>
            location.id === id ? { ...location, ...locationData } : location
          ),
        }));
      },

      deleteLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((location) => location.id !== id),
        }));
      },

      getLocationById: (id) => {
        return get().locations.find((location) => location.id === id);
      },

      getChildLocations: (parentId) => {
        return get().locations.filter((location) => location.parentId === parentId);
      },

      getRootLocations: () => {
        return get().locations.filter((location) => location.parentId === undefined);
      },

      getHouses: () => {
        return get().locations.filter((location) => location.type === 'house');
      },

      getRooms: (houseId) => {
        return get().locations.filter(
          (location) => location.type === 'room' && location.parentId === houseId
        );
      },
    }),
    {
      name: 'home-inventory-locations',
    }
  )
);
