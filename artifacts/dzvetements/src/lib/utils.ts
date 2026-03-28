import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace("DZD", "DA");
}

export function generateSessionId(): string {
  const stored = sessionStorage.getItem("dzv_session");
  if (stored) return stored;
  
  const newSession = crypto.randomUUID();
  sessionStorage.setItem("dzv_session", newSession);
  return newSession;
}

export const CONDITIONS: Record<string, { label: string; color: string }> = {
  new: { label: "Nouveau (جديد)", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  like_new: { label: "Comme neuf", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  good: { label: "Bon état", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  fair: { label: "Acceptable", color: "bg-orange-500/10 text-orange-700 border-orange-200" },
};
