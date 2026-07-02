import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard Anggaran | Sync to Google Sheets',
  description: 'Kelola anggaran dengan cerdas, sinkron dua arah dengan Google Sheets, dan didukung oleh Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
