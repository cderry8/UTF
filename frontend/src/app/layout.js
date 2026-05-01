import './globals.css';
import Navbar from "./components/static/Navbar";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "UTF League - EAFC Pro Clubs League Management",
  description: "The ultimate platform for EAFC Pro Clubs competitive league management. Track stats, manage fixtures, and compete for glory.",
  keywords: ["EAFC", "Pro Clubs", "FIFA", "League Management", "Esports", "Competitive Gaming"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <main className=" w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
