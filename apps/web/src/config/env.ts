export const env = {
  apiUrl: import.meta.env['VITE_API_URL'],
  embedUrl: import.meta.env['VITE_EMBED_URL'],
  cdnUrl: import.meta.env['VITE_CDN_URL'],
  /** TEMP: false yapınca email/şifre login tekrar zorunlu olur */
  authBypass: import.meta.env['VITE_AUTH_BYPASS'] !== 'false',
  devtools: {
    reactQuery: import.meta.env['VITE_DEVTOOLS_REACT_QUERY'] === 'true',
    tanstackRouter: import.meta.env['VITE_DEVTOOLS_TANSTACK_ROUTER'] === 'true',
  },
};
