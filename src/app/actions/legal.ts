'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { LegalPage } from '@/models/LegalPage';
import { LEGAL_DEFAULTS as DEFAULTS } from '@/lib/legal-content';

export type LegalKey = 'privacy' | 'terms';

export type LegalPageRow = {
  key: LegalKey;
  title: string;
  content: string;
  updatedAt: string;
};


export async function getLegalPage(key: LegalKey): Promise<LegalPageRow> {
  await connectDB();
  let doc = await LegalPage.findOne({ key }).lean() as { key: LegalKey; title: string; content: string; updatedAt?: Date } | null;
  if (!doc) {
    const created = await LegalPage.create({ key, ...DEFAULTS[key] });
    doc = created.toObject();
  }
  return {
    key,
    title: doc!.title ?? DEFAULTS[key].title,
    content: doc!.content ?? '',
    updatedAt: doc!.updatedAt instanceof Date ? doc!.updatedAt.toISOString() : '',
  };
}

export async function updateLegalPage(
  key: LegalKey,
  data: { title: string; content: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (!data.title.trim()) return { ok: false, error: 'กรุณากรอกชื่อหน้า' };
    await connectDB();
    await LegalPage.findOneAndUpdate(
      { key },
      { title: data.title.trim(), content: data.content },
      { upsert: true },
    );
    revalidatePath(`/${key}`);
    for (const locale of ['th', 'en', 'ja']) revalidatePath(`/${locale}/${key}`);
    revalidatePath('/admin/settings/legal');
    return { ok: true };
  } catch (e) {
    console.error('[updateLegalPage]', e);
    return { ok: false, error: 'บันทึกไม่สำเร็จ' };
  }
}
