import AppMenu from "./components/AppMenu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppMenu />
        {children}
      </body>
    </html>
  )
}
