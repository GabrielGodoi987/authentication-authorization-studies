import { Plus } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductCardComponent({
  imageUrl,
  title,
  subtitle,
  price,
  action,
}: {
  imageUrl: string
  title: string
  subtitle: string
  price: number
  action: () => void
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="h-1/2">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
        <strong className="text-base font-medium leading-tight">{title}</strong>
        <span className="text-sm text-muted-foreground">{subtitle}</span>

        <span className="mt-auto pt-2 text-lg font-bold">
          {price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Button
          variant="outline"
          className="w-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={action}
        >
          <Plus className="size-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  )
}
