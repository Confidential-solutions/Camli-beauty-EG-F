/** Brand media hosted on the official Camli Shopify store CDN. */
const F = "https://www.camlibeautyeg.com/cdn/shop/files";
export const brandMedia = {
  logoDark: `${F}/Camli_logo.png?v=1704291549&width=400`,
  logoLight: `${F}/Camli_logo_White.png?v=1704291762&width=400`,
  campaign: `${F}/camli_summer_photoshoots.png?v=1791123667&width=1400`,
  texture: `${F}/Untitled_design-11_6571ee98-85b5-4350-8c79-842a6c70af33.png?v=1707219199&width=1200`,
  video:
    "https://www.camlibeautyeg.com/cdn/shop/videos/c/vp/08d248aeedb24aeb87fabd7283729b8a/08d248aeedb24aeb87fabd7283729b8a.HD-1080p-7.2Mbps-96449605.mp4?v=0",
  videoPoster: `${F}/preview_images/bfb7fd8c5d7e4d41b3e541b1e1d61633.thumbnail.0000000000.jpg?v=1778515395&width=1200`,
  reels: [
    "1c753a9f99d04dc9a8f3d6d24475af62.thumbnail.0000000000.jpg?v=1784672490",
    "28d26e4bd0c14978b9ed63b93952b46a.thumbnail.0000000000.jpg?v=1784670744",
    "4034567a6c2945a8b2099a24a4593666.thumbnail.0000000000.jpg?v=1784672868",
    "457976550d784f91834c9488838ab512.thumbnail.0000000000.jpg?v=1785691586",
    "a1ac850d20614fd79d159baa93f8863b.thumbnail.0000000000.jpg?v=1784671843",
  ].map((f) => `${F}/preview_images/${f}&width=600`),
};
