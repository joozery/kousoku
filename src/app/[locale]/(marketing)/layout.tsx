import { CookieConsentBanner } from '@/components/home/cookie-consent';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { FloatingContact } from '@/components/home/floating-contact';

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white text-slate-800">
      <SiteHeader />
      {children}
      <SiteFooter />
      <FloatingContact />
      <CookieConsentBanner />
    </div>
  );
}
