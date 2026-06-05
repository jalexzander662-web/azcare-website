import { useState } from 'react';
import Topbar from './components/Topbar';
import Nav from './components/Nav';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Process from './components/Process';
import WhyUs from './components/WhyUs';
import Counters from './components/Counters';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WAFloat from './components/WAFloat';
import BookModal from './components/BookModal';
import DetailModal from './components/DetailModal';
import { useScrollReveal } from './components/useScrollReveal';

export default function App() {
  const [bookOpen, setBookOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailService, setDetailService] = useState(null);
  const [detailBrand, setDetailBrand] = useState('');
  const [activePage, setActivePage] = useState('cleaning');

  useScrollReveal();

  const openDetail = (service, brand) => {
    setDetailService(service);
    setDetailBrand(brand);
    setDetailOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetail = () => {
    setDetailOpen(false);
    document.body.style.overflow = '';
  };

  const openBook = () => {
    setBookOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBook = () => {
    setBookOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <Topbar />
      <Nav onBookClick={openBook} onPageNav={setActivePage} />
      <Hero onBookClick={openBook} />
      <TrustStrip />
      <Services activePage={activePage} onPageChange={setActivePage} onDetailOpen={openDetail} />
      <Gallery />
      <Process />
      <WhyUs />
      <Counters />
      <Reviews />
      <Contact />
      <Footer />
      <WAFloat />
      <BookModal open={bookOpen} onClose={closeBook} />
      <DetailModal open={detailOpen} onClose={closeDetail} service={detailService} brand={detailBrand} />
    </>
  );
}
