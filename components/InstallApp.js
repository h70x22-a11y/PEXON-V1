'use client';
import { useEffect, useState } from 'react';
import { TbBrandApple, TbBrandAndroid, TbDotsVertical, TbSquarePlus, TbX } from 'react-icons/tb';

// صندوق "حمّل التطبيق" في صفحة الدخول: iPhone أو Android
const TXT = {
  ar: {
    title: 'حمّل التطبيق على جوالك',
    iphone: 'iPhone',
    android: 'Android',
    install: 'تثبيت التطبيق',
    iosSteps: ['افتح هذي الصفحة من Safari', 'اضغط زر المشاركة', 'اختر "إضافة إلى الشاشة الرئيسية"', 'اضغط "إضافة"'],
    andSteps: ['افتح هذي الصفحة من Chrome', 'اضغط القائمة', 'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"', 'اضغط "تثبيت"'],
    otherDevice: 'افتح الرابط هذا من جوالك:',
    done: 'تمام',
  },
  en: {
    title: 'Get the app on your phone',
    iphone: 'iPhone',
    android: 'Android',
    install: 'Install app',
    iosSteps: ['Open this page in Safari', 'Tap the Share button', 'Choose "Add to Home Screen"', 'Tap "Add"'],
    andSteps: ['Open this page in Chrome', 'Tap the menu', 'Choose "Install app" or "Add to Home screen"', 'Tap "Install"'],
    otherDevice: 'Open this link on your phone:',
    done: 'Got it',
  },
};

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
  </svg>
);

export default function InstallApp({ lang = 'ar' }) {
  const t = TXT[lang === 'en' ? 'en' : 'ar'];
  const [show, setShow] = useState(false);
  const [device, setDevice] = useState('other');
  const [open, setOpen] = useState('');
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) return;
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    setDevice(ios ? 'ios' : /android/i.test(ua) ? 'android' : 'other');
    setShow(true);
    const onPrompt = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    const onInstalled = () => setShow(false);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!show) return null;

  const choose = async (which) => {
    if (which === 'android' && prompt) {
      prompt.prompt();
      try {
        const r = await prompt.userChoice;
        if (r?.outcome === 'accepted') setShow(false);
      } catch {}
      setPrompt(null);
      return;
    }
    setOpen(open === which ? '' : which);
  };

  const steps = open === 'ios' ? t.iosSteps : t.andSteps;
  const icons = open === 'ios' ? [null, <ShareIcon key="s" />, <TbSquarePlus key="p" />, null] : [null, <TbDotsVertical key="d" />, null, null];
  const elsewhere = open && open !== device;

  return (
    <div className="app-install">
      <div className="app-install-title">{t.title}</div>
      <div className="app-install-btns">
        <button type="button" className={`app-install-btn${device === 'ios' ? ' is-mine' : ''}${open === 'ios' ? ' is-open' : ''}`} onClick={() => choose('ios')}>
          <TbBrandApple aria-hidden="true" /> {t.iphone}
        </button>
        <button type="button" className={`app-install-btn${device === 'android' ? ' is-mine' : ''}${open === 'android' ? ' is-open' : ''}`} onClick={() => choose('android')}>
          <TbBrandAndroid aria-hidden="true" /> {prompt && device === 'android' ? t.install : t.android}
        </button>
      </div>
      {open ? (
        <div className="app-install-steps" role="region">
          <button type="button" className="app-install-close" onClick={() => setOpen('')} aria-label={t.done}><TbX /></button>
          {elsewhere ? (
            <p className="app-install-link">
              {t.otherDevice} <bdi dir="ltr">powercore.sa/admin</bdi>
            </p>
          ) : null}
          <ol>
            {steps.map((s, i) => (
              <li key={i}>
                <span>{s}</span>
                {icons[i] ? <span className="app-install-ico">{icons[i]}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
