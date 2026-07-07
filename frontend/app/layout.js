import ThemeRegistry from './theme/ThemeRegistry';

export const metadata = {
  title: 'ResearchGPT',
  description: 'AI-powered research assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}