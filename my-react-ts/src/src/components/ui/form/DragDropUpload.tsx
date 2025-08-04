import { Upload, Modal, Button, type UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';

interface DragDropUploadProps {
    fileList: UploadFile[];
    setFileList: (files: UploadFile[]) => void;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({ fileList, setFileList }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const beforeUpload = () => false; // блокує автозавантаження

    const onUploadChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
        setFileList(newList.filter((f) => f.status !== 'removed'));
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reordered = [...fileList];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        setFileList(reordered);
    };

    const handlePreview = (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = URL.createObjectURL(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = (uid: string) => {
        setFileList(fileList.filter((file) => file.uid !== uid));
    };

    return (
        <div className="space-y-4">
            <Upload
                multiple
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={onUploadChange}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Вибрати файли</Button>
            </Upload>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex flex-wrap gap-3"
                        >
                            {fileList.map((file, index) => (
                                <Draggable key={file.uid} draggableId={file.uid} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="relative w-24 h-24 border border-gray-300 dark:border-gray-600 rounded overflow-hidden dark:bg-gray-700"
                                        >
                                            <img
                                                src={
                                                    file.thumbUrl ||
                                                    (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')
                                                }
                                                alt="preview"
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => handlePreview(file)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full shadow p-1 text-xs hover:bg-red-500 hover:text-white dark:text-gray-300 dark:hover:bg-red-600"
                                                onClick={() => handleRemove(file.uid)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal 
                open={previewOpen} 
                footer={null} 
                onCancel={() => setPreviewOpen(false)}
                className="dark:bg-gray-900"
                title={<span className="dark:text-white/90">Попередній перегляд</span>}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default DragDropUpload;
