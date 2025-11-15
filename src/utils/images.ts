export const isGoogleAvatar = (url: string) =>
  url.startsWith('https://lh') && url.includes('googleusercontent.com');
