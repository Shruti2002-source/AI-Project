import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InsightSynth AI | Enterprise Consulting Intelligence',
  description: 'AI-powered consulting intelligence platform for automated KPI analysis, benchmarking, and executive insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-enterprise-light">
        {children}
      </body>
    </html>
  );
}
