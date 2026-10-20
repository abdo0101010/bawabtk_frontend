import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopNav, type RouteId } from '@/components/TopNav';
import { Home } from '@/modules/Home';
import { Auth } from '@/modules/Auth';
import { Dashboard } from '@/modules/Dashboard';
import { Checkout } from '@/modules/Checkout';
import { Scanner } from '@/modules/Scanner';
import { TeacherDashboard } from '@/modules/TeacherDashboard';

function App() {
  const [route, setRoute] = useState<RouteId>('home');

  function navigate(r: RouteId) {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-sand-50 font-sans text-forest-700">
      <TopNav current={route} onNavigate={navigate} />

      <AnimatePresence mode="wait">
        <motion.main
          key={route}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {route === 'home' && <Home onNavigate={navigate} />}
          {route === 'auth' && <Auth onNavigate={navigate} />}
          {route === 'dashboard' && <Dashboard />}
          {route === 'checkout' && <Checkout />}
          {route === 'scanner' && <Scanner />}
          {route === 'teacher' && <TeacherDashboard />}
        </motion.main>
      </AnimatePresence>

      <footer className="border-t border-sand-200 bg-sand-50 py-8 text-center text-sm text-forest-700/50">
        <p>بوابتك · Bawabtek LMS — نموذج تجريبي © 2026</p>
      </footer>
    </div>
  );
}

export default App;
