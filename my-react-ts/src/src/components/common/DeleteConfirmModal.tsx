import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal } from "antd";

export interface DeleteConfirmModalRef {
    open: (id: number) => void;
}

interface DeleteConfirmModalProps {
    onDelete: (id: number) => void;
    loading?: boolean;
    message?: string;
}

const DeleteConfirmModal = forwardRef<DeleteConfirmModalRef, DeleteConfirmModalProps>(
    ({ onDelete, loading = false, message = "Ви дійсно бажаєте видалити цю категорію?" }, ref) => {
        const [open, setOpen] = useState(false);
        const [selectedId, setSelectedId] = useState<number | null>(null);

        useImperativeHandle(ref, () => ({
            open: (id: number) => {
                setSelectedId(id);
                setOpen(true);
            },
        }));

        const handleOk = () => {
            if (selectedId !== null) {
                onDelete(selectedId);
            }
            setOpen(false);
            setSelectedId(null);
        };

        const handleCancel = () => {
            setOpen(false);
            setSelectedId(null);
        };

        return (
            <Modal
                title={<span className="dark:text-white/90">Підтвердження видалення</span>}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Видалити"
                cancelText="Скасувати"
                okButtonProps={{ danger: true, loading }}
                className="dark:bg-gray-900"
            >
                <span className="dark:text-gray-300">{message}</span>
            </Modal>
        );
    }
);

export default DeleteConfirmModal;