import type {IProductItem} from "../../services/types.ts";
import {APP_ENV} from "../../env";
import {Link} from "react-router";

const SimpleCard = ({ product }: { product: IProductItem }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <img
                src={`${APP_ENV.IMAGES_800_URL}${product.productImages[0]?.name}`}
                alt={product.name}
                className="w-full h-72 object-cover"
            />

            <h2 className={"font-bold mx-3 mt-5"} >{product.name}</h2>

            <div className="p-4 flex flex-col flex-1">
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
            {product.price} ₴
          </span>
                    <Link
                        to={`/products/list/${product.slug}?variant=${product.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Хочу
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SimpleCard;