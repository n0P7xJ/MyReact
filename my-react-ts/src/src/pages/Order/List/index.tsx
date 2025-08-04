import {useGetAllOrdersQuery} from "../../../services/apiOrder.ts";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";
import { Collapse, Button, Badge } from "antd";
import {APP_ENV} from "../../../env";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import type {IOrder} from "../../../services/types.ts";

const { Panel } = Collapse;

const UserOrderList: React.FC = () => {
    const {data: orderList, isLoading} = useGetAllOrdersQuery()

    if(isLoading)return (<LoadingOverlay />)

    if (!orderList || orderList.length === 0) {
        return (
            <div className="container py-10 text-lg leading-relaxed">
                <h2 className="text-2xl font-semibold mb-6">Мої замовлення</h2>
                <p>У вас ще немає замовлень.</p>
            </div>
        );
    }

    return(
        <div className={'container py-10 text-lg leading-relaxed'}>
            <h2 className="text-2xl font-semibold mb-6">Мої замовлення</h2>

            <Collapse
                accordion={false}
                expandIconPosition="right"
                className="bg-white dark:bg-gray-800"
            >

                {orderList.map((order: IOrder) => (
                    <Panel
                        header={
                            <div className="flex justify-between items-center w-full text-base sm:text-lg">
                                <div>
                                    <strong>Замовлення #{order.id}</strong>
                                    <div className="text-gray-500 text-sm">
                                        {new Date(order.dateCreated).toLocaleString()}
                                    </div>
                                </div>
                                <Badge
                                    className="text-base"
                                    status="processing"
                                    color="blue"
                                    text={order.status}
                                />
                            </div>
                        }
                        key={order.id.toString()}
                        className="rounded-md shadow-sm mb-4"
                    >
                        <ul className="divide-y">
                            {order.orderItems.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center py-4 px-2 text-base"
                                >
                                    {item.productImage && (
                                        <img
                                            src={`${APP_ENV.IMAGES_800_URL}${item.productImage}`}
                                            alt={item.productName}
                                            className="w-14 h-14 object-cover rounded mr-4"
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <strong>{item.productName}</strong>
                                            <Link to={`/products/list/${item.productSlug}`}>
                                                <Button
                                                    size="small"
                                                    icon={<EyeOutlined />}
                                                    className="m-0"
                                                />
                                            </Link>
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            Кількість: {item.count} × {item.priceBuy} грн
                                        </div>
                                    </div>

                                    <div className="font-semibold whitespace-nowrap pl-4">
                                        {item.count * item.priceBuy} грн
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {order.deliveryInfo && (
                            <div className="mt-6 p-4 border rounded bg-gray-50 dark:bg-gray-900 text-sm">
                                <h3 className="text-base font-semibold mb-2">Інформація про доставку</h3>
                                <p><strong>Отримувач:</strong> {order.deliveryInfo.recipientName}</p>
                                <p><strong>Телефон:</strong> {order.deliveryInfo.phoneNumber}</p>
                                <p><strong>Місто:</strong> {order.deliveryInfo.city.name}</p>
                                <p><strong>Відділення пошти:</strong> {order.deliveryInfo.postDepartment.name}</p>
                                <p><strong>Тип оплати:</strong> {order.deliveryInfo.paymentType.name}</p>
                            </div>
                        ) }

                        <div className="text-right pt-4 text-lg font-semibold border-t mt-4">
                            Загальна сума: {order.totalPrice} грн
                        </div>
                    </Panel>
                ))}

            </Collapse>
        </div>
    );
}

export default UserOrderList;