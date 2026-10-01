'use client';

import Image from 'next/image';
import { ConsentMap } from '@/components/home/consent-map';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowUpRight, MapPin, Phone, Mail, Clock, Headset, Check, Navigation, MessagesSquare } from 'lucide-react';
import { QuoteRequestForm } from '@/components/home/quote-request-form';
import { CONTACT_INFO } from '@/lib/home-content';

const shell = 'mx-auto max-w-7xl px-6 lg:px-10';
const mapQuery = encodeURIComponent(CONTACT_INFO.address);
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

export function ContactSection() {
  const t = useTranslations('contact');
  const p = useTranslations('contactPage');
  const channels = [
    { icon: Phone, title: t('phoneLabel'), value: CONTACT_INFO.phone, description: p('phoneIntro'), href: CONTACT_INFO.phoneHref, action: p('call') },
    { icon: Mail, title: t('emailLabel'), value: CONTACT_INFO.email, description: p('emailIntro'), href: `mailto:${CONTACT_INFO.email}`, action: p('emailAction') },
    { icon: MessagesSquare, title: 'LINE Official', value: CONTACT_INFO.lineId, description: p('lineIntro'), href: CONTACT_INFO.lineUrl, action: p('lineAction') },
  ];

  return (
    <main className="bg-[#f8fafc] text-[#102654]">
      <section className="relative isolate overflow-hidden bg-[#06274c] text-white">
        <Image src="/cover/cover.png" alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05264d]/95 via-[#05264d]/75 to-[#05264d]/10" />
        <div className={`relative py-12 lg:py-14 ${shell}`}>
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-sky-200"><span className="h-px w-7 bg-sky-300/70" />CONTACT US</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight lg:text-[44px]">{t('title')}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-blue-50">{t('subtitle')}</p>
        </div>
      </section>

      <section aria-label={p('channels')} className={`py-9 lg:py-10 ${shell}`}>
        <div className="grid gap-5 md:grid-cols-3">{channels.map(({ icon: Icon, ...channel }, index) => <a key={channel.title} href={channel.href} target={index === 2 ? '_blank' : undefined} rel={index === 2 ? 'noopener noreferrer' : undefined} className="group rounded-xl border border-blue-100/70 bg-white p-6 shadow-[0_3px_12px_rgba(15,45,85,0.04)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"><div className="flex items-center justify-between"><span className={`grid h-12 w-12 place-items-center rounded-xl ${index === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></span><ArrowUpRight size={19} aria-hidden="true" className="text-blue-300 transition-colors group-hover:text-blue-600" /></div><h2 className="mt-4 text-xs font-semibold text-[#7a8cac]">{channel.title}</h2><p className="mt-1 break-words text-xl font-bold">{channel.value}</p><p className="mt-2 text-sm leading-relaxed text-[#7183a2]">{channel.description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">{channel.action}<ArrowRight size={14} aria-hidden="true" /></span></a>)}</div>
      </section>

      <section className={`grid items-start gap-7 pb-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 ${shell}`}>
        <div>
          <p className="text-[11px] font-bold tracking-[0.23em] text-blue-500">LET’S TALK</p>
          <h2 className="mt-2 whitespace-pre-line text-3xl font-bold leading-snug">{p('talkTitle')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#7183a2]">{p('talkIntro')}</p>
          <ul className="mt-6 space-y-3">{[0, 1, 2].map(index => <li key={index} className="flex items-center gap-3 text-sm"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100/70 text-blue-600"><Check size={14} aria-hidden="true" /></span>{p(`help.${index}`)}</li>)}</ul>
          <div className="mt-7 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-5"><Clock size={23} aria-hidden="true" className="shrink-0 text-blue-600" /><div><h3 className="text-sm font-bold">{t('hoursLabel')}</h3><p className="mt-1 text-sm leading-relaxed text-[#607496]">{t('hours')}</p></div></div>
          <div className="relative isolate mt-5 overflow-hidden rounded-xl bg-[#092f60] p-6 text-white"><Image src="/company-profile/pneumatic-page.jpg" alt="" fill sizes="500px" className="object-cover object-[center_35%]" /><div className="absolute inset-0 bg-gradient-to-r from-[#062958] via-[#062958]/90 to-[#062958]/25" /><div className="relative max-w-[270px]"><Headset size={27} strokeWidth={1.6} aria-hidden="true" className="text-sky-200" /><h3 className="mt-3 text-xl font-bold">{p('expertTitle')}</h3><p className="mt-2 text-sm leading-relaxed text-blue-100">{p('expertIntro')}</p><a href={CONTACT_INFO.lineUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-blue-700 hover:bg-blue-50">{p('lineAction')}<ArrowUpRight size={15} /></a></div></div>
        </div>

        <QuoteRequestForm />
      </section>

      <section aria-labelledby="contact-location" className={`pb-12 lg:pb-16 ${shell}`}>
        <div className="overflow-hidden rounded-2xl border border-blue-100/70 bg-white lg:grid lg:grid-cols-[0.75fr_1.25fr]">
          <div className="p-6 sm:p-8 lg:p-9"><p className="text-[11px] font-bold tracking-[0.23em] text-blue-500">OUR LOCATION</p><h2 id="contact-location" className="mt-2 text-2xl font-bold">{p('locationTitle')}</h2><p className="mt-5 text-sm font-bold">KOUSOKU (THAILAND) CO., LTD.</p><div className="mt-3 flex items-start gap-3"><MapPin size={21} aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" /><p className="text-sm leading-relaxed text-[#7183a2]">{CONTACT_INFO.address}</p></div><a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 hover:bg-blue-100"><Navigation size={16} aria-hidden="true" />{p('directions')}<ArrowUpRight size={15} aria-hidden="true" /></a></div>
          <ConsentMap query={mapQuery} title={p('mapTitle')} />
        </div>
      </section>
    </main>
  );
}
