import BookingForm from './BookingForm'

export default function BookingModal({ selected, catalog, onSubmit, onClose }) {
  return (
    <div
      className="az-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="az-book" role="dialog" aria-modal="true" aria-label="Book our service" style={{ '--bk-px': '2.5rem', paddingBottom: 0 }}>
        <button type="button" className="az-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h3>📋 Book Our Service</h3>
        <BookingForm mode="modal" selected={selected} catalog={catalog} onSubmit={onSubmit} onClose={onClose} />
      </div>
    </div>
  )
}
