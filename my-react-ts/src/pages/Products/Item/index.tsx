import {useEffect, useState} from "react";
import {useGetProductBySlugQuery} from "../../../services/apiProduct.ts";
import {useParams} from "react-router";
import type {IProductVariant} from "../../../services/types.ts";
import {APP_ENV} from "../../../env";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";
import {useAppSelector} from "../../../store";
import {type ICartItem} from "../../../store/localCartSlice.ts";
import {useCart} from "../../../hooks/useCart.ts";

const ProductItemPage: React.FC = () => {
    const { slug } = useParams();
    const { data: product, isLoading } = useGetProductBySlugQuery(slug!);

    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);
    const [mainImage, setMainImage] = useState<string | null>(null);

    const {user} = useAppSelector(state => state.auth);

    const {cart, addToCart } = useCart(user!=null);

    const isInCart = cart.some(item =>
        product &&
        item.productId === (selectedVariant ? selectedVariant.id : product.id)
    );

    const handleAddToCart = async () => {
        if (!product) return;

        console.log("product add", product);

        const newItem: ICartItem = {
            productId: selectedVariant?.id ?? product.id,
            quantity: 1,
            sizeName: selectedVariant?.productSize?.name ?? product.productSize?.name,
            price: selectedVariant?.price ?? product.price,
            imageName: selectedVariant?.productImages?.[0]?.name ?? product.productImages?.[0]?.name ,
            name: product.name,
        };

        await addToCart(newItem);

    };

    useEffect(() => {
        if (!product) return;

        if (product.variants?.length > 0) {
            const variant = product.variants[0];
            setSelectedVariant(variant);
            setMainImage(variant.productImages?.[0] ? `${APP_ENV.IMAGES_800_URL}${variant.productImages[0].name}` : null);
        } else {
            setSelectedVariant(null);
            setMainImage(product.productImages?.[0] ? `${APP_ENV.IMAGES_800_URL}${product.productImages[0].name}` : null);
        }
    }, [product]);

    const handleThumbnailClick = (imgName: string) => {
        setMainImage(`${APP_ENV.IMAGES_800_URL}${imgName}`);
    };

    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div>
                    <img
                        src={mainImage ?? ''}
                        alt={product.name}
                        className="rounded-xl mb-4 w-full h-[400px] object-cover shadow"
                    />
                    <div className="flex gap-2 flex-wrap">
                        {(selectedVariant?.productImages || product.productImages)?.map((img, i) => (
                            <img
                                key={i}
                                src={`${APP_ENV.IMAGES_200_URL}${img.name}`}
                                alt={`Thumbnail ${i}`}
                                onClick={() => handleThumbnailClick(img.name)}
                                className="w-20 h-20 rounded-md object-cover cursor-pointer border-2 border-transparent hover:border-orange-500"
                            />
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                    <p className="text-gray-500 mb-2">Категорія: {product.category?.name}</p>
                    <p className="text-gray-500 mb-2">Вага: {selectedVariant?.weight ?? product.weight} г</p>
                    <p className="text-2xl font-semibold text-orange-500 mb-4">
                        {selectedVariant?.price ?? product.price} ₴
                    </p>

                    {product.variants?.length > 0 ? (
                        <div className="mb-4">
                            <h5 className="mb-2 font-medium">Розмір:</h5>
                            <div className="flex gap-2 flex-wrap">
                                {product.variants.map((variant) => (
                                    <div key={variant.id} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id={`size-${variant.id}`}
                                            name="size"
                                            className="hidden peer"
                                            checked={selectedVariant?.id === variant.id}
                                            onChange={() => {
                                                setSelectedVariant(variant);
                                                setMainImage(
                                                    variant.productImages?.[0]
                                                        ? `${APP_ENV.IMAGES_800_URL}${variant.productImages[0].name}`
                                                        : null
                                                );
                                            }}
                                        />
                                        <label
                                            htmlFor={`size-${variant.id}`}
                                            className="peer-checked:bg-orange-500 peer-checked:text-white border border-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-orange-100"
                                        >
                                            {variant.productSize?.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <p className="text-gray-600">Розмір: {product.productSize?.name}</p>
                        </div>
                    )}

                    <div>
                        <h5 className="text-lg font-semibold mb-2">Інгредієнти:</h5>
                        <div className="flex gap-3 flex-wrap">
                            {product.productIngredients?.map((ingredient, i) => (
                                <div key={i} className="text-center w-20">
                                    <img
                                        src={`${APP_ENV.IMAGES_200_URL}${ingredient.image}`}
                                        alt={ingredient.name}
                                        className="w-full h-16 object-cover rounded shadow"
                                    />
                                    <span className="text-sm mt-1 block">{ingredient.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={isInCart}
                        className={`${
                            isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
                        } text-white font-bold py-2 px-4 mt-5 rounded-full`}
                        onClick={!isInCart ? handleAddToCart : undefined}
                    >
                        {isInCart ? "Вже в кошику" : "В кошик"}
                    </button>
                </div>
            </div>
            {isLoading && <LoadingOverlay />}
        </div>
    );
};

export default ProductItemPage;
