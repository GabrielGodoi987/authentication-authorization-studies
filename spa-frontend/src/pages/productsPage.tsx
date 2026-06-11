import MainLayout from "@/layouts/main.layout"
import ProductCardComponent from "@/components/product-card.component"
import Footer from "@/components/footer.component"
import { useCartStore } from "@/store/cart.store"

const mockProducts = [
  {
    id: "1",
    imageUrl: "https://placehold.co/400x400/1a1a2e/eeeeee?text=Resistor",
    title: "Resistor 10kΩ",
    subtitle: "Resistor de filme de carbono 1/4W ±5%",
    price: 0.50,
  },
  {
    id: "2",
    imageUrl: "https://placehold.co/400x400/16213e/eeeeee?text=Capacitor",
    title: "Capacitor 100µF",
    subtitle: "Capacitor eletrolítico 25V 105°C",
    price: 1.20,
  },
  {
    id: "3",
    imageUrl: "https://placehold.co/400x400/0f3460/eeeeee?text=Arduino",
    title: "Arduino Uno R3",
    subtitle: "Placa de desenvolvimento ATmega328P",
    price: 89.90,
  },
  {
    id: "4",
    imageUrl: "https://placehold.co/400x400/533483/eeeeee?text=LED",
    title: "LED Vermelho 5mm",
    subtitle: "LED difuso 5mm 2V 20mA",
    price: 0.30,
  },
  {
    id: "5",
    imageUrl: "https://placehold.co/400x400/e94560/eeeeee?text=Breadboard",
    title: "Breadboard 830 pontos",
    subtitle: "Protoboard para montagem de circuitos",
    price: 24.90,
  },
  {
    id: "6",
    imageUrl: "https://placehold.co/400x400/1a1a2e/eeeeee?text=Multimetro",
    title: "Multímetro Digital",
    subtitle: "Multímetro DT830B com pontas de prova",
    price: 39.90,
  },
]

export default function ProductsPage() {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <MainLayout>
      <section className="flex flex-col items-center justify-center px-4 pt-24 pb-12 text-center bg-muted/30">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Bem-vindo à nossa loja
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Explore nossos produtos e faça seu carrinho de compras
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {mockProducts.map((product) => (
          <ProductCardComponent
            key={product.id}
            imageUrl={product.imageUrl}
            title={product.title}
            subtitle={product.subtitle}
            price={product.price}
            action={() =>
              addItem({
                productId: product.id,
                imageUrl: product.imageUrl,
                title: product.title,
                unitPrice: product.price,
              })
            }
          />
        ))}
      </section>

      <Footer />
    </MainLayout>
  )
}
