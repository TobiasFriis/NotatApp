import Modal from "./Modal";
type Props = {
    modalOpen: boolean;
    onClose: () => void;
    handleDeleteNote: () => void;
};

const DeleteNoteModal = ({ modalOpen, onClose, handleDeleteNote }: Props) => {
    return (
        <Modal open={modalOpen} onClose={onClose}>
            <Modal.Header>
                <h3>Delete Note</h3>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this note?</p>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleDeleteNote}>Delete</button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteNoteModal;
