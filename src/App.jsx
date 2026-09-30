import { useState, useEffect } from 'react';
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
import CheckoutPage from './components/CheckoutPage';
import ProductsPage from './components/ProductsPage';
import { useScrollReveal } from './components/useScrollReveal';

export default function App() {
  const [bookOpen, setBookOpen] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState('');
  
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailService, setDetailService] = useState(null);
  const [detailBrand, setDetailBrand] = useState('');
  
  // Navigation States
  const [activePage, setActivePage] = useState('main'); 
  const [currentPage, setCurrentPage] = useState('main'); 
  const [orderCompletedData, setOrderCompletedData] = useState(null);

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  
  // Products State from Google Sheet
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLU7x56fRc5YBnca91B4JOPneelUS2ruD1JFX8Nyk4vclCyzd69AjeXqXtgY5WxhUh/exec';

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error('Failed to load global products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      fetchProducts();
    } else {
      setProducts([
        { id: '1', name: 'Premium Car Shampoo', price: '1200', description: 'Deep foam cleaning formula', image: 'https://via.placeholder.com/280' },
        { id: '2', name: 'Microfiber Cleaning Cloth', price: '450', description: 'Scratch-free ultra absorbent towel', image: 'https://via.placeholder.com/280' }
      ]);
      setLoadingProducts(false);
    }
  }, []);

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

  const openBookWithService = (serviceName = '') => {
    setSelectedBookingService(serviceName);
    setBookOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBook = () => {
    setBookOpen(false);
    setSelectedBookingService('');
    document.body.style.overflow = '';
  };

  // Cart Functions
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.id) === String(product.id));
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleProceedToCheckout = () => {
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOrder = async (customerData) => {
    const orderId = 'AZ-' + Math.floor(100000 + Math.random() * 900000);
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
    const itemsSummary = cartItems
      .map((item) => `${item.name || item.title} (x${item.quantity || 1})`)
      .join(', ');

    const newOrder = {
      action: 'createOrder',
      orderId,
      name: customerData.name,
      address: customerData.address,
      phone: customerData.phone,
      items: itemsSummary,
      totalPrice
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newOrder),
      });
    } catch (err) {
      console.error('Error saving order to backend:', err);
    }

    setOrderCompletedData({ orderId, name: customerData.name });
    setCartItems([]);
  };

  const handleCloseThanksPopup = () => {
    setOrderCompletedData(null);
    setCurrentPage('main');
  };

  const handlePageNav = (page) => {
    if (page === 'products') {
      setCurrentPage('products-page');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('main');
      setActivePage(page);
    }
  };

  // Render Checkout Page View
  if (currentPage === 'checkout') {
    return (
      <CheckoutPage
        cartItems={cartItems}
        onBack={() => setCurrentPage('main')}
        onCompleteOrder={handleCompleteOrder}
        orderCompletedData={orderCompletedData}
        onCloseThanksPopup={handleCloseThanksPopup}
      />
    );
  }

  // Render Dedicated Products Page View
  if (currentPage === 'products-page') {
    return (
      <>
        <Topbar />
        <Nav
          onBookClick={() => openBookWithService('')}
          onPageNav={handlePageNav}
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onProceedToCheckout={handleProceedToCheckout}
        />
        <ProductsPage
          products={products}
          loadingProducts={loadingProducts}
          onAddToCart={handleAddToCart}
          onBack={() => setCurrentPage('main')}
        />
        <Footer />
        <WAFloat />
      </>
    );
  }

  // Render Main Homepage View
  return (
    <>
      <Topbar />
      <Nav
        onBookClick={() => openBookWithService('')}
        onPageNav={handlePageNav}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <Hero 
        onBookClick={() => openBookWithService('')} 
        onExploreProducts={() => handlePageNav('products')}
      />
      <TrustStrip />
      <Services
        activePage={activePage}
        onPageChange={setActivePage}
        onDetailOpen={openDetail}
        onBookService={(svcName) => openBookWithService(svcName)}
        sheetProducts={products}
        loadingProducts={loadingProducts}
        onAddToCart={handleAddToCart}
      />
      <Gallery />
      <Process />
      <WhyUs />
      <Counters />
      <Reviews />
      <Contact />
      <Footer />
      <WAFloat />
      <BookModal 
        open={bookOpen} 
        onClose={closeBook} 
        selectedService={selectedBookingService} 
      />
      <DetailModal 
        open={detailOpen} 
        onClose={closeDetail} 
        service={detailService} 
        brand={detailBrand} 
      />
    </>
  );
}