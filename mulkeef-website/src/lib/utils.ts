import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "AED") {
  return new Intl.NumberFormat("en-AE", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price) + " " + currency;
}

export function formatArea(sqft: number) {
  return new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: 0,
  }).format(sqft) + " sqft";
}

export const WHATSAPP_URL = "https://wa.me/971585765719";
export const WHATSAPP_MESSAGE = (property?: string) =>
  property
    ? `Hi MULKEEF, I'm interested in: ${property}`
    : "Hi MULKEEF, I'd like to discuss a property inquiry.";
