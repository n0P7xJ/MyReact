import {Link, Outlet, useNavigate} from "react-router";
import {Button, Form, type FormProps} from "antd";
import {APP_ENV} from "../../env";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../store";
import { logout } from "../../store/authSlice";
import CartDrawer from "../../components/Cart/CartDrewer";
import {useCart} from "../../hooks/useCart.ts";
import { apiCart } from "../../services/apiCart.ts";
import {addItem} from "../../store/localCartSlice.ts";
import UserMenuSideBar from "../../components/header/UserMenuSideBar.tsx";

const UserLayout: React.FC = () => {

    const {user} = useAppSelector(state => state.auth);

    const { cart } = useCart(user!=null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        // if (!serverCart?.items) return;

        const serverCart = [...cart];
        dispatch(logout());
        console.log('Server cart', serverCart);
        dispatch(apiCart.util.resetApiState());
        console.log('Server cart', serverCart);
        serverCart.forEach(item => {
            dispatch(addItem(item));
        });
        navigate('/')
    }

    const onProductSearch: FormProps<{ name: string }>['onFinish'] = async (values) => {
        console.log('Search', values);
        navigate("/products/list?name=" + encodeURIComponent(values.name));
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
            <header className="w-full py-4 px-6 bg-orange-500 text-white shadow-md flex justify-between">
                <div className="hidden items-center gap-4 lg:flex">
                    <Link to="/" className="text-xl font-semibold">FoodDelivery</Link>
                    <Link to="/products/list/">Продукти</Link>
                </div>

                <div className="mt-1 max-w-64">

                    <Form onFinish={onProductSearch} className="flex gap-3 items-center max-w-sm mx-auto">
                        <Form.Item
                            name="name"
                            className="w-full !mb-0"
                        >
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 outline-0 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full ps-10 p-2.5"
                                    placeholder="Search branch name..."
                                />

                            </div>
                        </Form.Item>

                        <Form.Item className="!mb-0 ms-2">
                            <button
                                type="submit"
                                className="p-2.5 me-2.5 text-sm font-medium text-white bg-orange-700 rounded-lg border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300"
                            >
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </Form.Item>
                    </Form>
                </div>

                <div className="lg:block hidden">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <CartDrawer/>

                            <Link to="/profile" className="flex items-center gap-2">
                                <img
                                    src={user.image ? `${APP_ENV.IMAGES_50_URL}${user.image}` : '/images/user/default.png'}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                />
                                <span className="font-medium">{user.name}</span>
                            </Link>

                            {user.role === "Admin" && (
                                <Link
                                    to="/admin/home"
                                    className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-100 transition"
                                >
                                    Адмінка
                                </Link>
                            )}

                            <Button
                                onClick={() => logoutHandler()}
                                className="bg-white text-orange-500 border-none hover:bg-orange-100"
                            >
                                Вихід
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <CartDrawer/>

                            <Link
                                to="login"
                                className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-100 transition"
                            >
                                Вхід
                            </Link>

                            <Link
                                to="registration"
                                className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-100 transition"
                            >
                                Реєстрація
                            </Link>
                        </div>
                    )}
                </div>

                <div className="lg:hidden flex gap-5 mt-2">
                    <CartDrawer />
                    <UserMenuSideBar />
                </div>

            </header>

            <main className="flex-1 p-6">
                <Outlet />
            </main>

            <footer className="w-full py-3 px-6 bg-gray-100 text-sm text-center dark:bg-gray-800 dark:text-gray-300">
                © 2025 FoodDelivery. Усі права захищено.
            </footer>
        </div>
    );
};

export default UserLayout;
