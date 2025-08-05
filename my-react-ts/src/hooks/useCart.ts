import {useDispatch, useSelector} from "react-redux";
import type { RootState } from "../store";
import {useCreateUpdateCartMutation, useGetCartQuery, useRemoveCartItemMutation} from "../services/apiCart.ts";
import {addItem, type ICartItem, removeItem} from "../store/localCartSlice.ts";

export const useCart = (isAuth: boolean) => {
    const dispatch = useDispatch();
    const localCart = useSelector((state: RootState) => state.localCart.items);

    const { data: remoteCart, ...remote } = useGetCartQuery(undefined, { skip: !isAuth });
    const [addRemote] = useCreateUpdateCartMutation();
    const [removeRemote] = useRemoveCartItemMutation();

    const addToCart = async (item: ICartItem) => {
        if (isAuth) {
            // console.log("Add remote cart", item);
            const existing = remoteCart?.find(i => i.productId === item.productId);
            const quantity = existing ? existing.quantity! + item.quantity! : 1;
            await addRemote({ ...item, quantity });

            console.log(item);
            console.log("Ex", existing);
            console.log(quantity);

        } else {
            dispatch(addItem(item));
        }
    };

    const removeFromCart = async (productId: number) => {
        if (isAuth) {
            await removeRemote( productId );
        } else {
            dispatch(removeItem(productId));
        }
    };

    return {
        cart: isAuth ? remoteCart! ?? [] : localCart as ICartItem[],
        addToCart,
        removeFromCart,
        ...remote,
    };
};