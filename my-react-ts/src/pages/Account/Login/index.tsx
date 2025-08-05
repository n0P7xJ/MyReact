import {Link, useNavigate} from "react-router";
import {Button, Form, type FormProps, Input, message} from "antd";
import type { ILogin, ServerError} from "../../../services/types.ts";
import {useFormServerErrors} from "../../../utilities/useFormServerErrors.ts";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";
import {useLoginByGoogleMutation, useLoginMutation} from "../../../services/apiAccount.ts";
import {useGoogleLogin} from "@react-oauth/google";
import {useGetCartQuery} from "../../../services/apiCart.ts";


const LoginPage: React.FC = () => {

    const { data: serverCart, isLoading: isLoadingCart } = useGetCartQuery();

    const [login, { isLoading: isLoginLoading, isError }] = useLoginMutation();
    const [loginByGoogle, { isLoading: isGoogleLoading }] = useLoginByGoogleMutation();

    const [form] = Form.useForm<ILogin>();
    const setServerErrors = useFormServerErrors(form);

    const navigate = useNavigate();

    console.log("isLoadingCart", isLoadingCart, "serverCart", serverCart);
    const onFinish: FormProps<ILogin>['onFinish'] = async (values) => {
        try {
            await login(values).unwrap();

            navigate('/');
        } catch (error) {
            const serverError = error as ServerError;

            if (serverError?.status === 400 && serverError?.data?.errors) {
                setServerErrors(serverError.data.errors);
            } else {
                message.error("Сталася помилка при вході");
            }
        }
    };

    const loginUseGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) =>
        {
            try {
                await loginByGoogle(tokenResponse.access_token).unwrap();
                // await asyncCartLocalStorage();
                navigate('/');
            } catch (error) {

                const serverError = error as ServerError;

                if (serverError?.status === 400 && serverError?.data?.errors) {
                    setServerErrors(serverError.data.errors);
                } else {
                    message.error("Сталася помилка при вході");
                }
            }
        },
    });



    return (
        <div className="min-h-[600px] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in">
                {(isLoginLoading || isGoogleLoading)  && <LoadingOverlay />}

                <h2 className="text-2xl font-semibold text-center text-orange-500 mb-6">Вхід в акаунт</h2>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-4"
                >
                    <Form.Item<ILogin>
                        label={<span className="text-gray-700 dark:text-white font-medium">Email</span>}
                        name="email"
                        rules={[{ required: true, message: 'Вкажіть email' }]}
                    >
                        <Input
                            className="rounded-lg py-2 px-4 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </Form.Item>

                    <Form.Item<ILogin>
                        label={<span className="text-gray-700 dark:text-white font-medium">Пароль</span>}
                        name="password"
                        rules={[{ required: true, message: 'Вкажіть пароль' }]}
                    >
                        <Input.Password
                            className="rounded-lg py-2 px-4 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </Form.Item>

                    {isError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            Неправильний логін або пароль
                        </div>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition"
                        >
                            Увійти
                        </Button>

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Забули пароль?
                            </Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            onClick={(event) =>  {
                                event.preventDefault();
                                loginUseGoogle();
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
                        >
                            Увійти Google
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    );
}

export default LoginPage;