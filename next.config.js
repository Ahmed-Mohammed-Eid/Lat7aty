/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_MAPS_API_KEY: "AIzaSyAQq1-2Hm_rdN0qKzPEwwzO4mWaVoJLNDQ",
  },
  images: {
    domains: ['picsum.photos', "unsplash.com", "images.unsplash.com", "source.unsplash.com", "images.pexels.com", "mandoob.kportals.net", "mandoobku.com", "api.lathaty.com", "lathaty.com"],
  },
}

module.exports = nextConfig
