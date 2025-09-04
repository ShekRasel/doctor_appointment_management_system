import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "via.placeholder.com", // fallback avatar
      "images.unsplash.com", // Unsplash images
      "res.cloudinary.com",
      "www.shutterstock.com",
      "static.vecteezy.com",
      "randomuser.me",
      "http://cvbcvb",
    ],
  },
};

export default nextConfig;
