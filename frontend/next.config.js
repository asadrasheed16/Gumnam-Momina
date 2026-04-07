/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const apiImagePattern = (() => {
  try {
    const u = new URL(apiUrl);
    const host = u.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return null;
    return { protocol: u.protocol.replace(':', ''), hostname: host };
  } catch {
    return null;
  }
})();

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'http', hostname: 'localhost' },
      ...(apiImagePattern ? [apiImagePattern] : []),
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  }
};

module.exports = nextConfig;
