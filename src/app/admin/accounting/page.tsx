import { getAccountingDocs } from '@/lib/accounting-docs';
import { AccountingDocsClient } from '@/components/admin/accounting/accounting-docs-client';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'เอกสารบัญชี | Admin' };

export default async function AccountingPage() {
  const docs = await getAccountingDocs();
  return <AccountingDocsClient docs={docs} />;
}
