export const metadata = {
  title: '마인드케어',
  description: '지친 당신의 마음에 전하는 따뜻한 전문 심리상담',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
