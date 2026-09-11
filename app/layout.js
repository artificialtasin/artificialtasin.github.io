export const metadata = {
  title: 'Artificial Tasin',
  description: 'AI Chatbot',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
