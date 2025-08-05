//Категорії

export interface ICategoryItem
{
    id: number;
    name: string;
    slug: string;
    image: string;
}

export interface ICategoryCreate
{
    name: string;
    slug: string;
    imageFile: string;
}

export interface ICategoryEdit
{
    id: number;
    name: string;
    slug: string;
    imageFile: string;
}

export interface ICategoryDelete
{
    id: number;
}

//Додаткові
export interface ServerError {
    status: number;
    data: {
        errors: Record<string, string[]>;
    };
}

//Користувач
export interface IRegister
{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFile: string;
}

export interface ILogin
{
    email: string;
    password: string;
}

export interface User {
    name: string;
    email: string;
    image: string;
    token: string;
    role: string;
}

//Товари
export interface IProductSize {
    id: number;
    name: string;
}

export interface IProductImages {
    name: string;
    priority: number;
}

export interface IIngredient {
    id: number;
    name: string;
    image: string;
}

export interface IProductVariant {
    id: number;
    weight: number;
    price: number;
    productSize: IProductSize;
    productImages: IProductImages[];
}

export interface IProductItem {
    id: number;
    name: string;
    slug: string;
    weight: number;
    price: number;
    category: ICategoryItem;
    productSize: IProductSize;
    productImages: IProductImages[];
    productIngredients: IIngredient[];
    variants: IProductVariant[];
}

export interface IProductCreate {
    name: string;
    slug: string;
    weight: number;
    price: number;
    categoryId: number;
    productSizeId: number | null;
    ingredientIds: number[] | null;
    imageFiles: string[] | null;
}

export interface IAdminUserItem {
    id: number;
    fullName: string;
    email: string;
    image: string;
    dateCreated: string;
    roles: string[];
    isGoogleLogin: boolean;
    isPasswordLogin: boolean;
}

export interface IPaginationModel {
    totalCount: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
}

export interface ISearchResult<T> {
    items: T[];
    pagination: IPaginationModel;
}

export interface IUserSearchParams {
    name?: string;
    roles?: string[];
    page?: number;
    itemPerPage?: number;
    startDate?: string;
    endDate?: string;
}

export interface IUserEdit {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
    roles?: string[];
}

export interface IUserDelete {
    id: number;
}

export interface IOrderItem {
    priceBuy: number;
    count: number;
    productId: number;
    productName: string;
    productSlug: string;
    productImage: string;
}

export interface IOrder {
    id: number;
    status: string;
    dateCreated: string;
    totalPrice: number;
    orderItems: IOrderItem[];
    deliveryInfo?: IDeliveryInfoItem;
}

export interface ICity {
    id: number;
    name: string;
}

export interface IPostDepartment {
    id: number;
    name: string;
}

export interface IPaymentType {
    id: number;
    name: string;
}

export interface IDeliveryInfoItem {
    id: number;
    recipientName: string;
    phoneNumber: string;
    city: ICity;
    postDepartment: IPostDepartment;
    paymentType: IPaymentType;
}

export interface IDeliveryInfoCreate {
    recipientName: string;
    phoneNumber: string;
    cityId: number;
    postDepartmentId: number;
    paymentTypeId: number;
}

export interface IGetCitiesRequest {
    itemPerPage:  number;
    name: string;
}

export interface IGetDepartmentsRequest {
    itemPerPage:  number;
    cityName: string;
}

export interface IProductSearchParams {
    page?: number;
    itemPerPage?: number;
    name?: string;
    categoryId?: number;
    productSizeId?: number;
    minPrice?: number;
    maxPrice?: number;
    prohibitedIngredientIds?: number[];
}