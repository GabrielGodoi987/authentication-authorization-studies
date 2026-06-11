import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProductsPage from "@/pages/productsPage"
import LoginPage from "@/pages/loginPage"
import CartPage from "@/pages/cartPage"
import AccountPage from "@/pages/accountPage"
import ProcessingPaymentPage from "@/pages/processingPayment"
import PaymentSuccessPage from "@/pages/paymentSuccessPage"
import LogoutPage from "@/pages/logoutPage"
import RegisterPage from "@/pages/registerPage"
import { ProtectedRoute } from "@/components/guards/protected-route"

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
])

export function Router() {
  return <RouterProvider router={router} />
}
