import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voting Platform',
  description: 'Create and vote on polls in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}