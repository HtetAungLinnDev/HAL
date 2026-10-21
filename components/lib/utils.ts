import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Lightswind UI shared helper: merge Tailwind class names.
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
