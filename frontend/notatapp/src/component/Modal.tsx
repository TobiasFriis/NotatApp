import React from "react";
import "../styling/Modal.css";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

type SubComponentProps = {
    children: React.ReactNode;
};

const Modal = ({ open, onClose, children }: ModalProps) => {
    return (
        <div className={`modal ${open ? "open" : ""}`} onClick={onClose}>
            <div className="modal-content">{children}</div>
        </div>
    );
};

const Header = ({ children }: SubComponentProps) => {
    return <div className="modal-header">{children}</div>;
};
const Body = ({ children }: SubComponentProps) => {
    return <div className="modal-body">{children}</div>;
};
const Footer = ({ children }: SubComponentProps) => {
    return <div className="modal-footer">{children}</div>;
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
