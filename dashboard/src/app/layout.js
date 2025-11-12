import './globals.css';
import Sidebar from "./components/static/Sidebar";

export const metadata = {
  title: 'UTF League',
  description: 'Ultimate Team Federation League',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='flex min-h-screen ' >
        <Sidebar />
        
        <main className="flex-1 p-4 ml-[72px] overflow-x-auto">
          {children}
        </main>
      </body>
    </html>
  );
}


