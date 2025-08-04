
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-{#1f2937}">
        <main>{children}</main>
      </body>
    </html>
  );
}
