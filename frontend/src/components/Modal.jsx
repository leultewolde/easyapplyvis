import '../styles/Modal.scss';

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    const handleOverlayClick = (e) => {
        // Close the modal when clicking outside the modal content
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
