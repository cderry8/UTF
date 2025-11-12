import './globals.css';
import Navbar from "./components/static/Navbar";

export const metadata = {
  title: 'UTF League',
  description: 'Ultimate Team Federation League',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       
        <main className=" w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
