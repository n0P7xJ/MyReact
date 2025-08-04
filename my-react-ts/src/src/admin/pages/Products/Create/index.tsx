import {useNavigate} from "react-router-dom";
import {useCreateProductMutation, useGetAllIngredientsQuery, useGetAllSizesQuery} from "../../../../services/apiProduct.ts";
import {useGetAllCategoriesQuery} from "../../../../services/apiCategory.ts";
import type {IProductCreate, ServerError} from "../../../../services/types.ts";
import LoadingOverlay from "../../../../components/ui/loading/LoadingOverlay.tsx";
import {useState} from "react";
import DragDropUpload from "../../../../components/ui/form/DragDropUpload.tsx";
import {Button, Form, Input, InputNumber, Select, message} from "antd";
import {useFormServerErrors} from "../../../../utilities/useFormServerErrors.ts";

const ProductCreatePage = () => {
    const [images, setImages] = useState<any[]>([]);
    const navigate = useNavigate();
    const [createProduct, {isLoading}] = useCreateProductMutation();
    const {data: sizes = []} = useGetAllSizesQuery();
    const {data: categories = []} = useGetAllCategoriesQuery();
    const {data: ingredients = []} = useGetAllIngredientsQuery();

    const [form] = Form.useForm<IProductCreate>();
    const setServerErrors = useFormServerErrors(form);

    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);

    const toggleIngredient = (id: number) => {
        setSelectedIngredients(prev => {
            const has = prev.includes(id);
            const newList = has ? prev.filter(i => i !== id) : [...prev, id];
            form.setFieldsValue({ ingredientIds: newList });
            return newList;
        });
    };

    const onFinish = async (values: IProductCreate) => {
        const payload: IProductCreate = {
            ...values,
            imageFiles: images.map(x => x.originFileObj),
        };
        try {
            await createProduct(payload).unwrap();
            message.success("Продукт створено успішно");
            navigate("..")
        } catch (e) {
            const error = e as ServerError;
            if (error?.status === 400 && error?.data?.errors) {
                setServerErrors(error.data.errors);
            } else {
                message.error("Помилка при створенні продукту");
            }
        }
    };

    return (
        <div className="container mt-5 bg-white dark:bg-gray-900 rounded-lg p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90">Створення продукту</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: "",
                    slug: "",
                    weight: 0,
                    price: 0,
                    productSizeId: null,
                    categoryId: 0,
                    ingredientIds: [],
                    imageFiles: []
                }}
                className="dark:text-white/90"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded p-4 dark:bg-gray-800">
                        <Form.Item label="Зображення" className="dark:text-white/90">
                            <DragDropUpload fileList={images} setFileList={setImages} />
                        </Form.Item>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded p-4 dark:bg-gray-800">
                        <Form.Item name="name" label="Назва" rules={[{required: true, message: "Вкажіть назву продукту"}]} className="dark:text-white/90">
                            <Input className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded mb-3 dark:bg-gray-700 dark:text-white/90" />
                        </Form.Item>

                        <Form.Item name="slug" label="Слаг" rules={[{required: true, message: "Вкажіть слаг"}]} className="dark:text-white/90">
                            <Input className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded mb-3 dark:bg-gray-700 dark:text-white/90" />
                        </Form.Item>

                        <Form.Item name="weight" label="Вага (г)" rules={[{required: true, type: 'number', min: 1}]} className="dark:text-white/90">
                            <InputNumber className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded mb-3 dark:bg-gray-700 dark:text-white/90" />
                        </Form.Item>

                        <Form.Item name="price" label="Ціна (грн)" rules={[{required: true, type: 'number', min: 0.01}]} className="dark:text-white/90">
                            <InputNumber className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded mb-3 dark:bg-gray-700 dark:text-white/90" />
                        </Form.Item>

                        <Form.Item name="productSizeId" label="Розмір" className="dark:text-white/90">
                            <Select className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded mb-3 dark:bg-gray-700 dark:text-white/90">
                                <Select.Option value={0}>Оберіть розмір</Select.Option>
                                {sizes.map(size => (
                                    <Select.Option key={size.id} value={size.id}>{size.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="categoryId" label="Категорія" rules={[{required: true, message: "Оберіть категорію"}]} className="dark:text-white/90">
                            <Select className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded mb-3 dark:bg-gray-700 dark:text-white/90">
                                <Select.Option value={0}>Оберіть категорію</Select.Option>
                                {categories.map(cat => (
                                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit" className="btn btn-success w-full mt-3 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700">
                                Додати продукт
                            </Button>
                        </Form.Item>
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded p-4 mt-5 dark:bg-gray-800">
                    <h5 className="mb-3 font-semibold text-gray-800 dark:text-white/90">Інгредієнти</h5>
                    <Form.Item name="ingredientIds">
                        <div className="flex flex-wrap gap-2">
                            {ingredients.map(ing => (
                                <div
                                    key={ing.id}
                                    onClick={() => toggleIngredient(ing.id)}
                                    className={`px-3 py-1 rounded cursor-pointer border ${
                                        selectedIngredients.includes(ing.id)
                                            ? 'bg-green-200 border-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white'
                                            : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                    }`}

                                >
                                    {ing.name}
                                </div>

                            ))}
                        </div>
                    </Form.Item>
                </div>
            </Form>

            {isLoading && <LoadingOverlay />}
        </div>
    );
};

export default ProductCreatePage;