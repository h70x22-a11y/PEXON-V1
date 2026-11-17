import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSnapchat,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

export const SOCIALS = [
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
  { key: 'x', label: 'X', Icon: FaXTwitter },
  { key: 'tiktok', label: 'TikTok', Icon: FaTiktok },
  { key: 'snapchat', label: 'Snapchat', Icon: FaSnapchat },
  { key: 'facebook', label: 'Facebook', Icon: FaFacebookF },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedinIn },
  { key: 'telegram', label: 'Telegram', Icon: FaTelegram },
];

export default function SocialIcons({ settings }) {
  const items = SOCIALS.filter((s) => settings[s.key]).map((s) => ({ ...s, href: settings[s.key] }));
  if (settings.whatsapp) {
    items.unshift({ key: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp, href: `https://wa.me/${settings.whatsapp}` });
  }
  if (!items.length) return null;
  return (
    <div className="socials">
      {items.map(({ key, label, Icon, href }) => (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
          <Icon size={22} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
