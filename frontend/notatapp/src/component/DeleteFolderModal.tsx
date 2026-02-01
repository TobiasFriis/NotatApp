import Modal from "./Modal";
type Props = {
    modalOpen: boolean;
    onClose: () => void;
    handleDeleteFolder: () => void;
};

const DeleteFolderModal = ({
    modalOpen,
    onClose,
    handleDeleteFolder,
}: Props) => {
    return (
        <Modal open={modalOpen} onClose={onClose}>
            <Modal.Header>
                <h3>Delete Folder</h3>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this folder?</p>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleDeleteFolder}>Delete</button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteFolderModal;
