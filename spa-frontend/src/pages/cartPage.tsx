import { useNavigate } from "react-router-dom"
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react"
import MainLayout from "@/layouts/main.layout"
import Footer from "@/components/footer.component"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart.store"

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, total } = useCartStore()

  const totalPrice = total()

  if (items.length === 0) {
    return (
      <MainLayout>
        <section className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center">
          <ShoppingCart className="size-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground">
            Adicione produtos da loja para começar
          </p>
          <Button onClick={() => navigate("/")}>Ver produtos</Button>
        </section>
        <Footer />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-6 text-2xl font-bold">Carrinho</h1>

          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-4 py-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="size-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <strong className="text-sm font-medium leading-tight">
                    {item.title}
                  </strong>
                  <p className="text-sm text-muted-foreground">
                    {item.unitPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded-md border transition-colors hover:bg-accent"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Minus className="size-3" />
                  </button>

                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded-md border transition-colors hover:bg-accent"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="size-3" />
                  </button>
                </div>

                <span className="w-24 text-right text-sm font-medium">
                  {(item.unitPrice * item.quantity).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>

                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Resumo</h2>

            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Itens</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-muted-foreground">Grátis</span>
            </div>

            <hr className="my-4" />

            <div className="mb-6 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                {totalPrice.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate("/pagamento/processando")}
            >
              Pagar
            </Button>
          </div>
        </aside>
      </section>

      <Footer />
    </MainLayout>
  )
}
