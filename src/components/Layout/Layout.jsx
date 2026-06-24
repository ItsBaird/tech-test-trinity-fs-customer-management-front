import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="min-h-screen bg-bg flex flex-col">
    <Navbar />
    <main className="max-w-6xl mx-auto w-full px-6 py-6 flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;