import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

interface MapState {
  center: [number, number];
  zoom: number;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}

interface Store {
  auth: AuthState;
  ui: UIState;
  map: MapState;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        setUser: (user) =>
          set((state) => ({
            auth: {
              ...state.auth,
              user,
              isAuthenticated: !!user,
            },
          })),
        setToken: (token) =>
          set((state) => ({
            auth: {
              ...state.auth,
              token,
            },
          })),
        logout: () =>
          set((state) => ({
            auth: {
              ...state.auth,
              user: null,
              token: null,
              isAuthenticated: false,
            },
          })),
      },
      ui: {
        isSidebarOpen: false,
        toggleSidebar: () =>
          set((state) => ({
            ui: {
              ...state.ui,
              isSidebarOpen: !state.ui.isSidebarOpen,
            },
          })),
        setSidebarOpen: (isOpen) =>
          set((state) => ({
            ui: {
              ...state.ui,
              isSidebarOpen: isOpen,
            },
          })),
      },
      map: {
        center: [0, 0],
        zoom: 10,
        setCenter: (center) =>
          set((state) => ({
            map: {
              ...state.map,
              center,
            },
          })),
        setZoom: (zoom) =>
          set((state) => ({
            map: {
              ...state.map,
              zoom,
            },
          })),
      },
    }),
    {
      name: "cloudy-storage",
      partialize: (state) => ({
        auth: {
          user: state.auth.user,
          token: state.auth.token,
          isAuthenticated: state.auth.isAuthenticated,
        },
      }),
    }
  )
);

// Convenience hooks for specific parts of the store
export const useAuth = () => useStore((state) => state.auth);
export const useUI = () => useStore((state) => state.ui);
export const useMap = () => useStore((state) => state.map);
