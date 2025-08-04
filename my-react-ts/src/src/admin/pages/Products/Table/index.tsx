import {Link} from "react-router";
import {BoxIcon} from "../../../../icons";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../../../components/ui/table";
import {useGetAllProductsQuery} from "../../../../services/apiProduct.ts";
import ProductTableItem from "../../../../components/ui/table/item/ProductTableItem.tsx";

const ProductTablePage: React.FC = () => {

    const { data: products, isLoading, isError } = useGetAllProductsQuery();

    if (isLoading) return <p className="text-gray-600 dark:text-gray-400">Loading...</p>;
    if (isError || !products) return <p className="text-gray-600 dark:text-gray-400">Something went wrong.</p>;

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Products
                    </h3>

                    <div className="flex items-center gap-3">
                        <button className="btn dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">Filter</button>
                        <button className="btn dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">See all</button>
                    </div>
                </div>

                <Link
                    to="create"
                    className="inline-flex items-center
                gap-2 px-4 py-2 bg-white text-black text-sm
                font-medium rounded-lg shadow-md
                hover:bg-green-400 transition mb-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    <BoxIcon className="text-black dark:text-gray-300 w-5 h-5" />
                    Додати
                </Link>

                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 text-start text-gray-800 dark:text-white/90">Product</TableCell>
                                <TableCell isHeader className="py-3 text-start text-gray-800 dark:text-white/90">Slug</TableCell>
                                <TableCell isHeader className="py-3 text-start text-gray-800 dark:text-white/90">Price</TableCell>
                                <TableCell isHeader className="py-3 text-start text-gray-800 dark:text-white/90">Category</TableCell>
                                <TableCell isHeader className="py-3 text-start text-gray-800 dark:text-white/90">Image</TableCell>
                                <TableCell isHeader className="py-3 text-start text-gray-800 dark:text-white/90">Action</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {products.map((product) => (
                                <ProductTableItem prod={product} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

export default ProductTablePage;