import { createContext, useContext, useState, type ReactNode } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  title: string;
  initials: string;
  department: string;
}

const DEFAULT_USER: CurrentUser = {
  id: "1",
  name: "Grant Carioni",
  title: "Senior Director, People & Culture",
  initials: "GC",
  department: "People & Culture",
};

interface AuthContextValue {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(DEFAULT_USER);
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCurrentUser(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useCurrentUser must be used within AuthProvider");
  return ctx;
}
