import { useState } from 'react';

export default function CheckoutPage({
  cartItems = [],
  onBack,
  onCompleteOrder,
  orderCompletedData,
  onCloseThanksPopup,
}) {
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsSubmitting(true);
    await onCompleteOrder(formData);
    setIsSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060f1e', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', background: '#0b1e3d', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: '#1e90ff', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px' }}
        >
          ← Back to Shop
        </button>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', textTransform: 'uppercase' }}>Checkout</h2>

        {/* Order Summary */}
        <div style={{ background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>Order Summary</h3>
          {cartItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0', fontSize: '0.9rem' }}>
              <span>{item.name || item.title} (x{item.quantity || 1})</span>
              <span>Rs. {(Number(item.price) || 0) * (item.quantity || 1)}</span>
            </div>
          ))}
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
            <span>Total:</span>
            <span style={{ color: '#00c4ff' }}>Rs. {totalPrice}</span>
          </div>
        </div>

        {/* Customer Details Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Delivery Address *</label>
            <textarea
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Placing Order...' : 'COMPLETE ORDER'}
          </button>
        </form>
      </div>

      {/* Thank You Popup */}
      {orderCompletedData && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#0b1e3d', padding: '30px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', border: '1px solid #16a34a' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#16a34a' }}>Thank You!</h3>
            <p style={{ marginBottom: '15px', color: '#7a90b5' }}>
              Your order has been placed successfully, <strong>{orderCompletedData.name}</strong>.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.85rem', color: '#7a90b5' }}>Order ID:</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00c4ff' }}>{orderCompletedData.orderId}</div>
            </div>
            <button
              onClick={onCloseThanksPopup}
              style={{ width: '100%', padding: '12px', background: '#1e90ff', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}