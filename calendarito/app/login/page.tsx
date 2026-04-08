import { Suspense } from 'react';
import LoginPageClient from './LoginPageClient';

function LoginPageFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-home)] pt-[68px]">
      <p className="text-sm text-[#666]">Loading login...</p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
