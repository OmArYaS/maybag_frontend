import { createBrowserRouter } from "react-router";
import Homepage from "../pages/homepage";
import Topnav from "../layouts/topnav";
import Products from "../pages/products";
import Wishlist from "../pages/wishlist";
import Cart from "../pages/cart";
import Account from "../pages/account";
import Auth from "../pages/auth";
import Login from "../layouts/login";
import Signup from "../layouts/signup";
import Product from "../pages/product";
import { loginAction } from "../service/loginAction.js";
import { registerAction } from "../service/registerAction.js";
import RequireAuth from "../components/requireAuth.jsx";
import Dashboard from "../pages/dashboard.jsx";
import control_products from "../layouts/control_products.jsx";
import orders from "../layouts/orders.jsx";
import ControlCategory from "../components/controlCategory.jsx";
import AddedProductByUser from "../components/addedproductbyuser.jsx";
import UserOrders from "../components/userorders.jsx";
import About from "../pages/about.jsx";
import ErrorBoundary from "../components/ErrorBoundary";
import RouteError from "../components/RouteError.jsx";
import { BACKEND_URL } from "../service/queryfn.js";
import contactUs from "../pages/contactUs.jsx";
export default createBrowserRouter([
  {
    path: "/",
    Component: Topnav,
    ErrorBoundary: RouteError,

    children: [
      {
        index: true,
        Component: Homepage,
      },
      {
        path: "products",
        Component: Products,
      },
      {
        path: "dashboard",
        Component: Dashboard,
        children: [
          {
            index: true,
            Component: control_products,
          },
          {
            path: "control_products",
            Component: control_products,
          },
          {
            path: "orders",
            Component: orders,
          },
          {
            path: "categories",
            Component: ControlCategory,
          },
        ],
      },
      {
        Component: RequireAuth,
        children: [
          {
            path: "/wishlist",
            Component: Wishlist,
          },
          {
            path: "/cart",
            Component: Cart,
            children: [
              {
                index: true,
                Component: AddedProductByUser,
              },
              {
                path: "addedproductbyuser",
                Component: AddedProductByUser,
              },
              {
                path: "userorders",
                Component: UserOrders,
              },
            ],
          },
          {
            path: "/account",
            Component: Account,
          },
        ],
      },
      {
        path: "/product/:id",
        Component: Product,
        loader: async ({ params }) => {
          let res = await fetch(`${BACKEND_URL}/api/products/id/${params.id}`);
          let data = await res.json();
          return data;
        },
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: contactUs,
      },
    ],
  },
  {
    path: "/auth",
    Component: Auth,
    children: [
      { path: "login", Component: Login, action: loginAction },
      { path: "signup", Component: Signup, action: registerAction },
    ],
  },
]);
