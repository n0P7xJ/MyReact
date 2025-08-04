import { TableCell, TableRow } from "../index.tsx";
import { APP_ENV } from "../../../../env";
import { Button, Space, Image, Tag } from "antd";
import { CloseCircleFilled, EditOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import type { IProductItem, IProductVariant } from "../../../../services/types.ts";
import { useState } from "react";

interface ProductTableItemProps {
    prod: IProductItem;
}

const CategoryTableItem: React.FC<ProductTableItemProps> = ({ prod }) => {
    const [open, setOpen] = useState(false);
    const hasVariants = prod.variants && prod.variants.length > 0;

    const renderImage = (src?: string) => (
        src ? (
            <Image
                src={`${APP_ENV.IMAGES_100_URL}${src}`}
                alt=""
                width={50}
                height={50}
                style={{ objectFit: 'cover', borderRadius: 6 }}
                preview={false}
            />
        ) : (
            <div className="h-[50px] w-[50px] bg-gray-200 dark:bg-gray-700 rounded-md" />
        )
    );

    return (
        <>
            <TableRow key={prod.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90">
                    <div className="flex gap-2">
                        {hasVariants && (
                            <Button
                                icon={open ? <UpOutlined /> : <DownOutlined />}
                                onClick={() => setOpen(!open)}
                                className="border-0 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Варіанти
                            </Button>
                        )}

                        <span>{prod.name}</span>
                    </div>
                </TableCell>

                <TableCell className="py-3 text-gray-500 dark:text-gray-400">{prod.slug}</TableCell>
                <TableCell className="py-3 text-gray-500 dark:text-gray-400">{prod.price}</TableCell>
                <TableCell className="py-3 text-gray-500 dark:text-gray-400">{prod.category.name}</TableCell>
                <TableCell className="py-3">{renderImage(prod.productImages?.[0]?.name)}</TableCell>

                <TableCell className="py-3">
                    {!hasVariants && (
                        <Space size="middle">
                            <Button icon={<EditOutlined />} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700" />
                            <Button danger icon={<CloseCircleFilled />} />
                        </Space>
                    )}
                </TableCell>
            </TableRow>

            {hasVariants && open && (
                prod.variants.map((variant: IProductVariant) => (
                    <TableRow key={variant.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                            <Tag color="blue">Розмір: {variant.productSize.name}</Tag>
                        </TableCell>
                        <TableCell className="py-3">-</TableCell>
                        <TableCell className="py-3 text-gray-500 dark:text-gray-400">{variant.price}</TableCell>
                        <TableCell className="py-3">-</TableCell>
                        <TableCell className="py-3">{renderImage(variant.productImages?.[0]?.name)}</TableCell>
                        <TableCell className="py-3">
                            <Space size="middle">
                                <Button icon={<EditOutlined />} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700" />
                                <Button danger icon={<CloseCircleFilled />} />
                            </Space>
                        </TableCell>
                    </TableRow>
                ))
            )}
        </>
    );
};

export default CategoryTableItem;
