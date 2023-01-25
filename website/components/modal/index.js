import { useEffect, useState,useRef } from "react";
import s from './modal.module.scss'
import { ContactForm } from '../contact-form'

export const Modal = ({ onClose }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const modalWrapperRef = useRef();

  // check if the user has clickedinside or outside the modal
  const backDropHandler = e => {
    if (!modalWrapperRef.current.contains(e.target)) {
        onClose();
    }
  }

  useEffect(() => {
    setIsBrowser(true);
   // attach event listener to the whole windor with our handler
    window.addEventListener('click', backDropHandler);
    // remove the event listener when the modal is closed
    return () => window.removeEventListener('click', backDropHandler);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  if (isBrowser) {
    return (
      <div className={s.modal}>
        <div  ref={modalWrapperRef} className={s.styledModalWrapper}>
          <div className={s.styledModal}>
            <div className={s.styledModalHeader}>
              <a href="#" onClick={handleCloseClick}>
                x
              </a>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    ) ;
  } else {
    return null;
  }
};

