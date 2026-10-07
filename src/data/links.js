// Contacts, socials and navigation — single source for Topbar, Nav, Footer, Contact and the WhatsApp links.
export const PHONE = '0322-2468123'
export const PHONE_HREF = 'tel:03222468123'
export const EMAIL = 'azcarepk@gmail.com'
export const WA_URL = 'https://wa.me/923222468123'
export const MAPS_URL = 'https://www.google.com/maps?q=24.9172661,67.0307852&z=17&hl=en'

export const LOGO = '/img/logo/az-care-logo.webp'
export const HERO_IMG = '/img/imagery/website-cover.webp'

// [key, href, Font Awesome class] — order is the design's
export const SOCIALS = [
  ['facebook', 'https://www.facebook.com/azcare.pk', 'fa-brands fa-facebook-f'],
  ['instagram', 'https://www.instagram.com/azcare.pk', 'fa-brands fa-instagram'],
  ['youtube', 'https://www.youtube.com/@azcarepk', 'fa-brands fa-youtube'],
  ['google', 'https://www.google.com/search?q=AZ+Care.pk', 'fa-brands fa-google'],
  ['whatsapp', WA_URL, 'fa-brands fa-whatsapp'],
  ['tiktok', 'https://www.tiktok.com/@azcarepk', 'fa-brands fa-tiktok'],
]

export const NAV_LINKS = [
  { label: 'Services', children: [{ label: 'HOME SERVICES' }, { label: 'CAR DETAILING' }, { label: 'LAUNDRY' }] },
  { label: 'Products' },
  { label: 'Process' },
  { label: 'Reviews' },
  { label: 'FAQ' },
  { label: 'Contact' },
]
