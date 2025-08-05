import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import LoadingOverlay from "./components/ui/loading/LoadingOverlay.tsx";

const DashboardHome = React.lazy(() => import("./admin/pages/Dashboard/DashboardHome.tsx"));
const AdminLayout = React.lazy(() => import("./layout/admin/AdminLayout.tsx"));
const NotFound = React.lazy(() => import("./pages/OtherPage/NotFound.tsx"));
const CategoriesListPage = React.lazy(() => import("./admin/pages/Categories"));
const UserLayout = React.lazy(() => import("./layout/user/UserLayout.tsx"));
const UserHomePage = React.lazy(() => import("./pages/OtherPage/UserHomePage.tsx"));
const CategoriesCreatePage = React.lazy(() => import("./admin/pages/Categories/Create"));
const CategoriesEditPage = React.lazy(() => import("./admin/pages/Categories/Edit"));
const LoginPage = React.lazy(() => import("./pages/Account/Login"));
const RegistrationPage = React.lazy(() => import("./pages/Account/Register"));
const RequireAdmin = React.lazy(() => import("./components/ProtectedRoute/RequireAdmin.tsx"));
const RequireLogin = React.lazy(() => import("./components/ProtectedRoute/RequireLogin.tsx"));
const ProductsListPage = React.lazy(() => import("./pages/Products"));
const ProductItemPage = React.lazy(() => import("./pages/Products/Item"));
const ProductTablePage = React.lazy(() => import("./admin/pages/Products/Table"));
const ProductCreatePage = React.lazy(() => import("./admin/pages/Products/Create"));
const ForgotPasswordPage = React.lazy(() => import("./pages/Account/ForgotPassword"));
const ForgotSuccessPage = React.lazy(() => import("./pages/Account/ForgotSuccess"));
const ResetPasswordPage = React.lazy(() => import("./pages/Account/ResetPassword"));
const UserListPage = React.lazy(() => import("./admin/pages/Users"));
const UserEditPage = React.lazy(() => import("./admin/pages/Users/Edit"));
const UserOrderList = React.lazy(() => import("./pages/Order/List"));
const CreateOrderPage = React.lazy(() => import("./pages/Order/Create"));
const ProfilePage = React.lazy(() => import("./pages/Account/Profile"));
const EditProfilePage = React.lazy(() => import("./pages/Account/EditProfile"));

const App: React.FC = () => {
    return (
        <Router>
            <React.Suspense fallback={<LoadingOverlay />}>
                <Routes>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<UserHomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="forgot-success" element={<ForgotSuccessPage />} />
                        <Route path="reset-password" element={<ResetPasswordPage />} />
                        <Route path="registration" element={<RegistrationPage />} />

                        <Route element={<RequireLogin/>}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="edit-profile" element={<EditProfilePage />} />

                            <Route path="order">
                                <Route path="list" element={<UserOrderList />} />
                                <Route path="create" element={<CreateOrderPage />} />
                            </Route>
                        </Route>

                        <Route path="products">
                            <Route path="list" element={<ProductsListPage />} />
                            <Route path="list/:slug" element={<ProductItemPage />} />
                        </Route>
                    </Route>

                    <Route path="admin" element={<RequireAdmin />}>
                        <Route element={<AdminLayout />}>
                            <Route path="home" element={<DashboardHome />} />

                            <Route path="categories">
                                <Route index element={<CategoriesListPage />} />
                                <Route path="create" element={<CategoriesCreatePage />} />
                                <Route path="edit/:slug" element={<CategoriesEditPage />} />
                            </Route>

                            <Route path="products">
                                <Route index element={<ProductTablePage />} />
                                <Route path="create" element={<ProductCreatePage />} />
                            </Route>

                            <Route path="users">
                                <Route index element={<UserListPage />} />
                                <Route path="edit/:id" element={<UserEditPage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </React.Suspense>
        </Router>
    );
};

export default App;
