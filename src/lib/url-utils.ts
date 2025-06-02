export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function ensureHttps(url: string): string {
  if (!url.startsWith('https://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }

  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  return url;
}
