// Data profil tetap untuk redesign v2. Dipakai sebagai nilai bawaan; pengaturan dari /admin (site_settings)
// tetap diutamakan bila terisi. Nomor HP pribadi sengaja tidak dicantumkan.
import type { Content } from './content';

export const PROFILE = {
  wordmark: 'Transbara',
  fullName: 'Transbara Wahyu Firmansyah',
  role: 'Founder & CEO SIDIGS',
  location: 'Malang, Indonesia',
  email: 'transbarawahyu@gmail.com',
  instagram: 'https://www.instagram.com/transbara.alfatih/',
  instagramHandle: '@transbara.alfatih',
  linkedin: 'https://www.linkedin.com/in/transbara-wahyu-firmansyah',
  linkedinHandle: 'transbara-wahyu-firmansyah',
  sidigsUrl: 'https://sidigs.com',
};

export function contactInfo(c: Content) {
  return {
    email: c.contact.email || PROFILE.email,
    instagram: c.social.instagram || PROFILE.instagram,
    linkedin: c.social.linkedin || PROFILE.linkedin,
  };
}
