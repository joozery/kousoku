'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <Image
        src="/cover/cover.png"
        alt=""
        fill
        priority
        className="object-cover -z-10"
      />
      <div className="absolute inset-0 bg-white/40 -z-10" />

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 bg-white/90 ring-1 ring-white/60 shadow-sm flex items-center justify-center">
            <Image src="/logo/logo.png" alt="Kosoku" width={80} height={80} className="object-contain w-full h-full" priority />
          </div>
          <h1 className="text-slate-900 text-xl font-bold drop-shadow-sm">Kosoku Admin</h1>
          <p className="text-slate-700 text-sm mt-1">เข้าสู่ระบบจัดการร้านค้า</p>
        </div>

        <form action={formAction} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-8 space-y-5">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              placeholder="admin"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {pending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          Kosoku © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
