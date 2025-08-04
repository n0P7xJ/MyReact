import {useAppDispatch, useAppSelector} from "../../../store";
import {APP_ENV} from "../../../env";
import {Button, Form, Input, Modal, Space} from "antd";
import {
    CheckLineIcon,
    MailIcon, PencilIcon,
    TimeIcon,
    UserIcon
} from "../../../icons";
import {useChangePasswordMutation, useDeleteAccountMutation} from "../../../services/apiAccount.ts";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";
import {useState} from "react";
import {Link, useNavigate} from "react-router";
import {logout} from "../../../store/authSlice.ts";
import type {ServerError} from "../../../services/types.ts";
import {useFormServerErrors} from "../../../utilities/useFormServerErrors.ts";
import {useGetLastOrderAddressQuery} from "../../../services/apiOrder.ts";
interface INewPasswords {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string
}

const ProfilePage : React.FC = () => {
    const {user} = useAppSelector(state => state.auth);

    const navigate = useNavigate();

    const [changePassword, {isLoading, isError}] = useChangePasswordMutation();
    const [deleteAccount] = useDeleteAccountMutation();
    const {data: lastAddress, isLoading: isAddressLoading} = useGetLastOrderAddressQuery();

    const [form] = Form.useForm<INewPasswords>();
    const setServerErrors = useFormServerErrors(form);

    const [isOpenPasswordForm, setIsOpenPasswordForm] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        await deleteAccount()
        dispatch(logout());
        navigate('/login');
    }

    const handleChangePassword = async (values: INewPasswords) => {
        if (values.newPassword !== values.confirmPassword) {
            form.setFields([
                {
                    name: "newPassword",
                    errors: ["Паролі не збігаються"]
                }
            ]);
            return;
        }

        try {
            await changePassword({ newPassword: values.newPassword, oldPassword: values.oldPassword }).unwrap();
            console.log("Пароль успішно змінено");
            setIsOpenPasswordForm(false);
        } catch (err) {
            const serverError = err as ServerError;

            if (serverError?.status === 400 && serverError?.data?.errors) {
                setServerErrors(serverError.data.errors);
            }

            console.log("Помилка при зміні паролю", err);
        }
    };

    if (isAddressLoading && isLoading) return <LoadingOverlay />;

    return (
        <div className="flex min-h-[500px] items-center justify-center">
            <div className="grid lg:grid-cols-12 grid-cols-12 place-items-center">
                <div className="min-h-[300px] shadow lg:col-span-10 col-span-10 w-full col-start-2 lg:col-start-2 px-10 place-content-center">
                    <div className="grid lg:grid-cols-5 grid-cols-1 lg:gap-12 gap-y-5">

                        <div className="flex justify-center">
                            <img
                                src={user!.image ? `${APP_ENV.IMAGES_400_URL}${user.image}` : '/images/user/default.png'}
                                alt={user!.name}
                                className="lg:w-[180px] w-[300px] object-cover rounded-full m-5"
                            />
                        </div>

                        <div className="col-span-2 grid grid-cols-1 ">
                            <div className="lg:place-items-start mb-3 place-items-center">
                                <div className="flex gap-1">
                                    <UserIcon/>
                                    <p className="text-xs">Ім'я</p>
                                </div>
                                <p className="text-2xl">{user!.name}</p>
                            </div>

                            <div className="lg:place-items-start mb-3 place-items-center">
                                <div className="flex gap-1">
                                    <CheckLineIcon/>
                                    <p className="text-xs">Роль</p>
                                </div>
                                <p className="text-xl">{user!.role}</p>
                            </div>

                            <div className="flex justify-center lg:justify-start mb-3">
                                <Button
                                    type="primary"
                                    className=" !bg-yellow-400 !text-black hover:!bg-yellow-600 hover:!text-white w-[140px]"
                                    onClick={() => setIsOpenPasswordForm(!isOpenPasswordForm)}
                                >Змінити пароль</Button>

                            </div>

                            <div className="flex justify-center lg:justify-start mb-3">
                                <Button
                                    type="primary"
                                    className="!bg-red-400 !text-black hover:!bg-red-600 hover:!text-white w-[140px]"
                                    onClick={() => {setIsOpenDeleteModal(true)}}
                                >Видалити акаунт</Button>
                            </div>
                        </div>

                        <div className="col-span-2 grid grid-cols-1 ">
                            <div className="flex justify-center lg:justify-between">
                                <div className="lg:place-items-start mb-3 place-items-center">
                                    <div className="flex gap-1">
                                        <MailIcon/>
                                        <p className="text-xs">Пошта</p>
                                    </div>
                                    <p className="text-xl">{user!.email}</p>
                                </div>


                                <Link to="/edit-profile" >
                                    <Button
                                        icon={<PencilIcon />}
                                        className="!hidden lg:!block justify-end"
                                    />
                                </Link>
                            </div>

                            <div className="lg:place-items-start mb-3 place-items-center">
                                <div className="flex gap-1">
                                    <TimeIcon/>
                                    <p className="text-xs">Остання адреса</p>
                                </div>
                                <p className="text-sm">{lastAddress}</p>
                            </div>

                            <div className="flex justify-center lg:justify-start mb-5">
                                <Button
                                    type="primary"
                                    className="!bg-green-300 !text-black hover:!bg-green-600 hover:!text-white w-[140px]"
                                >
                                    <Link to='/order/list/'>
                                        Список замовлень
                                    </Link>
                                </Button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <Modal
                open={isOpenPasswordForm}
                onCancel={() => setIsOpenPasswordForm(!isOpenPasswordForm)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item<INewPasswords>
                        name="oldPassword"
                        label={<span className="text-gray-700 dark:text-white font-medium">Старий пароль</span>}
                        rules={[{ required: true, message: 'Вкажіть старий пароль' }]}
                    >
                        <Input.Password className="rounded-lg py-2 px-4 dark:bg-gray-800 dark:text-white" />
                    </Form.Item>

                    <Form.Item<INewPasswords>
                        name="newPassword"
                        label={<span className="text-gray-700 dark:text-white font-medium">Новий пароль</span>}
                        rules={[{ required: true, message: 'Вкажіть новий пароль' }]}
                    >
                        <Input.Password className="rounded-lg py-2 px-4 dark:bg-gray-800 dark:text-white" />
                    </Form.Item>

                    <Form.Item<INewPasswords>
                        name="confirmPassword"
                        label={<span className="text-gray-700 dark:text-white font-medium">Повторіть пароль</span>}
                        rules={[{ required: true, message: 'Повторіть пароль' }]}
                    >
                        <Input.Password className="rounded-lg py-2 px-4 dark:bg-gray-800 dark:text-white" />
                    </Form.Item>

                    {isError && <Space className={"text-red-600"}>Сталася помилка, перевірте поля</Space>}

                    <Form.Item>
                        <Button
                            htmlType="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition"
                        >
                            Підтвердити
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={isOpenDeleteModal}
                onCancel={() => setIsOpenDeleteModal(!isOpenDeleteModal)}
                onOk={handleDelete}
            >
                <p>Ви справді хочте видалити акаунт?</p>
            </Modal>
        </div>
    );
}

export default ProfilePage;