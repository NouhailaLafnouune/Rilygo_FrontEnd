import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const Layout = () => {
  return (
    // min-h-screen pour toute la hauteur, bg spécifique pour le gris clair
    <div className="flex min-h-screen bg-[#F8F9FB] w-full">
      
      {/* Sidebar : Assure-toi qu'il a une largeur fixe (ex: w-64) */}
      <div className="w-64 min-w-[256px] h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Zone de contenu : flex-1 pour prendre tout l'espace restant */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-8 lg:p-10 w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Layout;