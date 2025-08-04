import { Button, Checkbox, Form, type FormProps, Input, message } from "antd";
import type {IUserEdit, ServerError} from "../../../../services/types.ts";
import ImageUploadFormItem from "../../../../components/ui/form/ImageUploadFormItem.tsx";
import { useNavigate, useParams } from "react-router";
import LoadingOverlay from "../../../../components/ui/loading/LoadingOverlay.tsx";
import {useFormServerErrors} from "../../../../utilities/useFormServerErrors.ts";
import {APP_ENV} from "../../../../env";
import {useEditUserMutation, useGetUserByIdQuery} from "../../../../services/apiUser.ts";
import {useMemo} from "react";
import {useAppSelector} from "../../../../store";

const UserEditPage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const id = Number(params.id) || 0;

    const { data, isLoading: isLoadingUser, isError: isErrorUser } = useGetUserByIdQuery(id);

    const user = useMemo(() => {
        if (!data) return undefined;

        const fullName = data.fullName?.trim() || '';
        const [firstName = '', ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');

        return {
            ...data,
            firstName,
            lastName,
            roles: data.roles || []
        };
    }, [data]);


    const [editUser, { isLoading: isLoadingEdit }] = useEditUserMutation();

    const [form] = Form.useForm<IUserEdit>();
    const setServerErrors = useFormServerErrors(form);

    const searchParams = useAppSelector(state => state.userSearch.searchParams);

    const onFinish: FormProps<IUserEdit>['onFinish'] = async (values) => {
        try {
            const result = await editUser(values).unwrap();
            console.log(result);

            navigate(`/admin/users?${searchParams}`);
        } catch (error) {
            const serverError = error as ServerError;

            if (serverError?.status === 400 && serverError?.data?.errors) {
                setServerErrors(serverError.data.errors);
            } else {
                message.error("Сталася помилка при зміні категорії");
            }
        }
    };

    if (isLoadingUser) return <p className="text-gray-600 dark:text-gray-400">Завантаження категорії...</p>;
    if (isErrorUser || !user) return <p className="text-gray-600 dark:text-gray-400">Категорія не знайдена.</p>;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            {(isLoadingEdit) && <LoadingOverlay />}
            <div className="max-w-full overflow-x-auto">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">Редагувати категорію</h1>
                <Form
                    form={form}
                    initialValues={user}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    layout="horizontal"
                    className="dark:text-white/90"
                >

                    <Form.Item name="id" noStyle>
                        <Input type="hidden" />
                    </Form.Item>

                    <Form.Item<IUserEdit>
                        label="Ім'я"
                        name="firstName"
                        rules={[{ required: true, message: 'Вкажіть назву категорії' }]}
                        className="dark:text-white/90"
                    >
                        <Input className="dark:bg-gray-700 dark:border-gray-600 dark:text-white/90" />
                    </Form.Item>

                    <Form.Item<IUserEdit>
                        label="Прізвище"
                        name="lastName"
                        rules={[{ required: true, message: 'Вкажіть слаг категорії' }]}
                        className="dark:text-white/90"
                    >
                        <Input className="dark:bg-gray-700 dark:border-gray-600 dark:text-white/90" />
                    </Form.Item>

                    <Form.Item<IUserEdit>
                        label="Пошта"
                        name="email"
                        rules={[{ required: true, message: 'Вкажіть слаг категорії' }]}
                        className="dark:text-white/90"
                    >
                        <Input className="dark:bg-gray-700 dark:border-gray-600 dark:text-white/90" />
                    </Form.Item>

                    <Form.Item<IUserEdit>
                        label="Ролі"
                        name="roles"
                        rules={[{ required: true, message: 'Оберіть хоча б одну роль' }]}
                    >
                        <Checkbox.Group>
                            <Checkbox value="User">User</Checkbox>
                            <Checkbox value="Admin">Admin</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <div className="flex flex-col items-center justify-center mt-6">
                        <div className="w-full max-w-sm">
                            <ImageUploadFormItem name="image" label="" initialImage={`${APP_ENV.IMAGES_400_URL}${user.image}`} />
                        </div>
                    </div>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" className="dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-700">
                            Змінити
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UserEditPage;
