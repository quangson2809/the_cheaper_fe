// Base URL of the Java backend API.
// Set VITE_API_BASE_URL in your .env.local file.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? 'http://localhost:8080/images';
