import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function ProcessingPaymentPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/pagamento/sucesso", { replace: true })
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Loader2 className="size-12 animate-spin text-primary" />
      <h1 className="text-2xl font-semibold">Processando pagamento</h1>
      <p className="text-muted-foreground">
        Aguarde enquanto confirmamos sua compra...
      </p>
    </div>
  )
}
