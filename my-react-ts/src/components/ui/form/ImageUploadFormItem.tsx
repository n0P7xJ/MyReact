import { useState } from "react";
import { Form, Upload, message } from "antd";
import { InboxOutlined, CloseCircleFilled } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";

const { Dragger } = Upload;

type ImageUploadFormItemProps = {
    name: string;
    label?: string;
    initialImage?: string | null;
};

const ImageUploadFormItem: React.FC<ImageUploadFormItemProps> = ({
                                                                     name,
                                                                     label = "Фото",
                                                                     initialImage = null,
                                                                 }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage);

    const props: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,
        beforeUpload: (file: RcFile) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error("Можна лише зображення!");
                return Upload.LIST_IGNORE;
            }

            setPreviewUrl(URL.createObjectURL(file));
            return false;
        },
        showUploadList: false,
        fileList: [],
    };

    return (
        <Form.Item
            label={label}
            name={name}
            getValueFromEvent={(e) =>
                e?.file?.originFileObj || e?.fileList?.[0]?.originFileObj || null
            }
            className="dark:text-white/90"
        >
            {!previewUrl ? (
                <Dragger {...props} accept="image/*" className="dark:bg-gray-700 dark:border-gray-600">
                    <p className="ant-upload-drag-icon dark:text-gray-300">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text dark:text-white/90">
                        Натисніть або перетягніть фото сюди
                    </p>
                    <p className="ant-upload-hint dark:text-gray-400">Тільки зображення (1 файл)</p>
                </Dragger>
            ) : (
                <div className="relative w-48 h-48 mx-auto border border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-md dark:bg-gray-700">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        className="absolute top-1 right-1 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 rounded-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => setPreviewUrl(null)}
                    >
                        <CloseCircleFilled className="text-xl" />
                    </button>
                </div>
            )}
        </Form.Item>
    );
};

export default ImageUploadFormItem;
