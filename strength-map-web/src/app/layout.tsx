import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'わたしの強みマップ',
  description: '5分で見つかる、あなたの魅力',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}