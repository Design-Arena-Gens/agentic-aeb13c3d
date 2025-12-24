export const metadata = {
  title: 'Gerador de Vídeo FNAF',
  description: 'Criador de histórias Five Nights at Freddy\'s em formato vertical 9:16',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
