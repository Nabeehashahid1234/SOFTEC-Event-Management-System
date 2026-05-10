import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AxiosError } from "axios";
import { api, AUTH_TOKEN_KEY } from "./api";

export type Role = "admin" | "participant" | "organizer" | "judge" | "sponsor";

export interface AuthUser {
  user_id: number;
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
}

interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (data: { name: string; email: string; password: string; role: Exclude<Role, "admin"> }) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

function mapUser(raw: any): AuthUser {
  return {
    user_id: Number(raw.user_id),
    id: String(raw.user_id),
    name: String(raw.name),
    email: String(raw.email),
    role: raw.role as Role,
    status: (raw.status || "active") as "active" | "inactive",
  };
}

function getApiError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as any)?.error || fallback;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        if (!active) return;
        setUser(mapUser(res.data.data));
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("[AUTH][FE] login request", { email });
      const res = await api.post("/auth/login", { email, password });
      console.log("[AUTH][FE] login response", res.data);
      const token = res.data?.data?.token;
      const rawUser = res.data?.data?.user;
      if (!token || !rawUser) throw new Error("Invalid login response");

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      const mapped = mapUser(rawUser);
      setUser(mapped);
      return mapped;
    } catch (error) {
      console.error("[AUTH][FE] login error", error);
      throw new Error(getApiError(error, "Login failed"));
    }
  };

  const signup = async (data: { name: string; email: string; password: string; role: Exclude<Role, "admin"> }) => {
    try {
      console.log("[AUTH][FE] signup request", { name: data.name, email: data.email, role: data.role });
      const res = await api.post("/auth/register", data);
      console.log("[AUTH][FE] signup response", res.data);
      const token = res.data?.data?.token;
      const rawUser = res.data?.data?.user;
      if (!token || !rawUser) throw new Error("Invalid register response");

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      const mapped = mapUser(rawUser);
      setUser(mapped);
      return mapped;
    } catch (error) {
      console.error("[AUTH][FE] signup error", error);
      throw new Error(getApiError(error, "Signup failed"));
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    window.location.href = "/login";
  };

  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}
