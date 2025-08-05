import {useAppDispatch, useAppSelector} from "../../../store";
import {APP_ENV} from "../../../env";
import {Button, Form, type FormProps, Input} from "antd";
import {
    MailIcon,
    UserIcon
} from "../../../icons";
import {useEditAccountMutation} from "../../../services/apiAccount.ts";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";
import {useNavigate} from "react-router";
import type {IUserEdit} from "../../../services/types.ts";
import ImageUploadFormItem from "../../../components/ui/form/ImageUploadFormItem.tsx";
import {loginSuccess} from "../../../store/authSlice.ts";

const EditProfilePage : React.FC = () => {
    const {user} = useAppSelector(state => state.auth);
    const [edit, {isLoading}] = useEditAccountMutation()

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [form] = Form.useForm<IUserEdit>();
    const initialFormObject = {
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1],
        email: user.email,
        image: user.image,
    }

    const onFinish: FormProps<IUserEdit>['onFinish'] = async (values) => {
        try {
            const res = await edit(values);
            console.log(res);
            dispatch(loginSuccess(res.data.token));
            navigate('/profile');
        }
        catch (error) {
            console.error(error);
        }
    }

    if (isLoading) return <LoadingOverlay />;

    return (
        <div className="flex min-h-[500px] items-center w-full">
            <div className="grid lg:grid-cols-12 grid-cols-12 w-full">
                <div className="min-h-[300px] shadow lg:col-span-6 col-span-8 w-full col-start-3 lg:col-start-4 px-10 place-content-center">

                    <Form
                        form={form}
                        initialValues={initialFormObject}
                        onFinish={onFinish}
                        layout="vertical"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        <div className="flex justify-center items-center col-span-1">
                            <ImageUploadFormItem name="image" label="" initialImage={`${APP_ENV.IMAGES_400_URL}${user.image}`} />
                        </div>

                        <div className="col-span-1 space-y-4">
                            <div>
                                <div className="flex gap-1">
                                    <UserIcon />
                                    <p className="text-xs">Ім'я</p>
                                </div>
                                <Form.Item<IUserEdit>
                                    label=""
                                    name="firstName"
                                    rules={[{ required: true, message: "Вкажіть ім'я" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div>
                                <div className="flex gap-1">
                                    <UserIcon />
                                    <p className="text-xs">Прізвище</p>
                                </div>
                                <Form.Item<IUserEdit>
                                    label=""
                                    name="lastName"
                                    rules={[{ required: true, message: "Вкажіть прізвище" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div>
                                <div className="flex gap-1">
                                    <MailIcon />
                                    <p className="text-xs">Пошта</p>
                                </div>
                                <Form.Item<IUserEdit>
                                    label=""
                                    name="email"
                                    rules={[{ required: true, message: "Вкажіть пошту" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="flex justify-center col-span-1 lg:col-span-2 mb-4">
                            <Button type="primary" htmlType="submit" className="w-48">
                                Підтвердити
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;