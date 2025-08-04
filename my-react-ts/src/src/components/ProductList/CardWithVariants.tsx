import {useState} from "react";
import type {IProductItem} from "../../services/types.ts";
import {Link} from "react-router";
import {APP_ENV} from "../../env";

const CardWithVariants = ({ product }: { product: IProductItem }) => {
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

    const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSizeName = e.target.value;
        const variant = product.variants.find(
            (v) => v.productSize.name === selectedSizeName
        );
        setSelectedVariant(variant!);
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <img
                src={`${APP_ENV.IMAGES_800_URL}${selectedVariant.productImages[0]?.name}`}
                alt={product.name}
                className="w-full h-72 object-cover"
            />

            <h2 className={"font-bold mx-3 mt-5"} >{product.name}</h2>

            <div className="p-4 flex flex-col flex-1">
                <select
                    className="mb-2 p-2 rounded-md border border-gray-300 text-sm"
                    value={selectedVariant.productSize.name}
                    onChange={handleVariantChange}
                >
                    {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.productSize.name}>
                            {variant.productSize?.name} • {variant.weight} г — {variant.price} ₴
                        </option>
                    ))}
                </select>

                <p className="text-sm text-gray-500 mb-4">
                    {product.productIngredients.slice(0, 5).map((ing, index, arr) => (
                        <span key={index}>
              {ing.name}
                            {index < arr.length - 1 ? ", " : ""}
            </span>
                    ))}
                    {product.productIngredients.length > 5 && " та інші..."}
                </p>

                <div className="mt-auto flex justify-between items-center">
          <span className="text-lg font-semibold text-green-600">
            {selectedVariant.price} ₴
          </span>
                    <Link
                        to={`/products/list/${product.slug}?variant=${selectedVariant.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Хочу
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CardWithVariants;