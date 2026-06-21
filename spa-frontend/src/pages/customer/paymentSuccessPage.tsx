import { useNavigate } from "react-router-dom"
import { CircleCheck, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart.store"
import { useEffect, useState } from "react"

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const clearCart = useCartStore((s) => s.clearCart)
  const [orderId] = useState(
    () => Math.random().toString(36).slice(2, 10).toUpperCase(),
  )

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <CircleCheck className="size-16 text-emerald-500" />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pagamento realizado!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Seu pedido foi confirmado e já está sendo processado.
        </p>
      </div>

      <div className="rounded-xl border px-6 py-4 text-left text-sm">
        <p className="text-muted-foreground">
          Pedido:{" "}
          <span className="font-mono font-medium text-foreground">
            #{orderId}
          </span>
        </p>
        <p className="mt-1 text-muted-foreground">
          Você receberá um e-mail com os detalhes da entrega.
        </p>
      </div>

      <Button
        className="gap-2"
        onClick={() => navigate("/")}
      >
        <Package className="size-4" />
        Continuar comprando
      </Button>
    </div>
  )
}
