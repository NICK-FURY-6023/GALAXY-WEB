// components/layout/Layout.js
import Header from './Header';
import Footer from './Footer';
import dynamic from 'next/dynamic'; // <-- dynamic ko import karo

// CHANGE: SplineScene ko is naye tareeke se import karo
const SplineScene = dynamic(() => import('../SplineScene'), {
  ssr: false, // Ye server par render nahi hoga, sirf client par
  loading: () => null, // Loading ke time kuch mat dikhao
});

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SplineScene />
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
}