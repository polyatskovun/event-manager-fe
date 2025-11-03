const Modal = ({ isOpen, onClose, title, children, size = 'default' }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" style={{ display: 'block' }} onClick={handleBackdropClick}>
      <div className={`modal-content ${size === 'large' ? 'modal-content-large' : ''}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="modal-close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
