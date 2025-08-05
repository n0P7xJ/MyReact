import { useState } from "react";
import {useAppSelector} from "../../store";
import {Button, Drawer} from "antd";
import {MoreDotIcon} from "../../icons";
import {Link, useNavigate} from "react-router";
import {APP_ENV} from "../../env";
import {logout} from "../../store/authSlice.ts";
import {apiCart} from "../../services/apiCart.ts";
import {addItem} from "../../store/localCartSlice.ts";
import {useDispatch} from "react-redux";
import {useCart} from "../../hooks/useCart.ts";

const UserMenuSideBar: React.FC = () => {
    const [open, setOpen] = useState(false);

    const {user} = useAppSelector(state => state.auth);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { cart } = useCart(user!=null);

    const logoutHandler = async () => {

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

    return (
        <>
            <Button onClick={() => setOpen(true)} icon={<MoreDotIcon />}></Button>

            <Drawer
                title="Акаунт"
                onClose={() => setOpen(false)}
                open={open}
                width={280}
            >
                <div className="flex flex-col gap-y-4 px-4 py-2">

                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 p-2 rounded hover:bg-orange-100 transition"
                            >
                                <img
                                    src={
                                        user.image
                                            ? `${APP_ENV.IMAGES_50_URL}${user.image}`
                                            : '/images/user/default.png'
                                    }
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                />
                                <span className="font-medium">{user.name}</span>
                            </Link>

                            {user.role === 'Admin' && (
                                <Link
                                    to="/admin/home"
                                    className="p-2 text-left rounded text-orange-500 hover:bg-orange-100 transition"
                                >
                                    Адмінка
                                </Link>
                            )}

                            <Button
                                onClick={logoutHandler}
                                className="p-2 text-left rounded text-orange-500 hover:bg-orange-100 border-none bg-white"
                            >
                                Вихід
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Вхід */}
                            <Link
                                to="/login"
                                className="p-2 text-left rounded text-orange-500 hover:bg-orange-100 transition"
                            >
                                Вхід
                            </Link>

                            {/* Реєстрація */}
                            <Link
                                to="/registration"
                                className="p-2 text-left rounded text-orange-500 hover:bg-orange-100 transition"
                            >
                                Реєстрація
                            </Link>
                        </>
                    )}
                </div>
            </Drawer>

        </>
    );
};

export default UserMenuSideBar;