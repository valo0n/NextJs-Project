/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "res.cloudinary.com",
      "www.figma.com",
      "images.unsplash.com",
    ],
  },
};

module.exports = nextConfig;
