import { IMAGE_BASE_URL } from '@/constants/config';

/**
 * Build a full image URL from a filename returned by the backend.
 * If the filename is already an absolute URL, return it as-is.
 */
export function getImageUrl(filename: string | null | undefined): string {
  if (!filename) return '/placeholder.png';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${IMAGE_BASE_URL}/${filename}`;
}
