/**
 * Format file size in bytes to human readable string
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format date to a readable string
 * @param date - Date object or string
 * @returns Formatted date string (e.g., "Jan 1, 2023, 12:00 PM")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d);
}

/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Check if a value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if an object has a specific property
 */
export function hasProperty<T extends object, K extends string>(
  obj: T, 
  prop: K
): obj is T & Record<K, unknown> {
  return prop in obj;
}

/**
 * Utility function to merge class names
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
