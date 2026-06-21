import { ProtectedRoute } from "@/components/guards/protected-route";
import AccountPage from "@/pages/customer/accountPage";
import CartPage from "@/pages/customer/cartPage";
import PaymentSuccessPage from "@/pages/customer/paymentSuccessPage";
import ProcessingPaymentPage from "@/pages/customer/processingPayment";
import RegisterPage from "@/pages/customer/registerPage";
import LoginPage from "@/pages/loginPage";
import LogoutPage from "@/pages/logoutPage";
import ProductsPage from "@/pages/productsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductsPage />,
  },
  {
    path: "/carrinho",
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/conta",
    element: (
      <ProtectedRoute>
        <AccountPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pagamento/processando",
    element: (
      <ProtectedRoute>
        <ProcessingPaymentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pagamento/sucesso",
    element: (
      <ProtectedRoute>
        <PaymentSuccessPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registrar",
    element: <RegisterPage />,
  },
  {
    path: "/sair",
    element: <LogoutPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
