import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  ShoppingBag,
  MapPin,
  Shield,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  KeyRound,
  Eye,
  EyeOff,
  Calendar,
  Mail,
  Smartphone,
  BadgeCheck,
  Clock,
  TriangleAlert,
  ChevronRight,
  History,
} from "lucide-react"
import MainLayout from "@/layouts/main.layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Tab = "perfil" | "compras" | "enderecos" | "seguranca"

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "compras", label: "Compras", icon: ShoppingBag },
  { id: "enderecos", label: "Endereços", icon: MapPin },
  { id: "seguranca", label: "Segurança", icon: Shield },
]

const mockUser = {
  name: "Gabriel Godoi",
  email: "gabriel@email.com",
  createdAt: new Date("2025-01-15"),
}

const mockOrders = [
  {
    id: "PED-001",
    date: new Date("2026-05-20"),
    total: 189.70,
    status: "Entregue" as const,
    items: 3,
  },
  {
    id: "PED-002",
    date: new Date("2026-06-01"),
    total: 45.90,
    status: "Processando" as const,
    items: 2,
  },
  {
    id: "PED-003",
    date: new Date("2026-06-10"),
    total: 299.00,
    status: "Cancelado" as const,
    items: 1,
  },
]

const mockAddresses = [
  {
    id: "1",
    label: "Casa",
    street: "Rua das Flores, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zip: "01001-000",
    isDefault: true,
  },
  {
    id: "2",
    label: "Trabalho",
    street: "Av. Paulista, 1000",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zip: "01310-100",
    isDefault: false,
  },
]

const statusConfig = {
  Entregue: { variant: "default" as const, label: "Entregue" },
  Processando: { variant: "secondary" as const, label: "Processando" },
  Cancelado: { variant: "destructive" as const, label: "Cancelado" },
}

export default function AccountPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>("perfil")
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(mockUser.name)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const TabIcon = tabs.find((t) => t.id === activeTab)!.icon

  return (
    <MainLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 lg:flex-row">
        <aside className="shrink-0 lg:w-56">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-active={isActive}
                  className="inline-flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground lg:w-full"
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              )
            })}

            <hr className="my-2 hidden border-t lg:block" />

            <button
              type="button"
              onClick={() => navigate("/sair")}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive lg:w-full"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </nav>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center gap-3">
            <TabIcon className="size-5 text-primary" />
            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          </div>

          {activeTab === "perfil" && (
            <section className="space-y-6">
              <div className="flex flex-col items-center gap-4 rounded-xl border p-6 sm:flex-row">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
                    <strong className="text-lg font-semibold">
                      {mockUser.name}
                    </strong>
                    <Badge
                      variant="secondary"
                      className="inline-flex items-center gap-1"
                    >
                      <BadgeCheck className="size-3" />
                      Autenticado
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mockUser.email}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setEditing(!editing)
                    setEditName(mockUser.name)
                  }}
                >
                  <Pencil className="size-3.5" />
                  Editar perfil
                </Button>
              </div>

              {editing && (
                <div className="rounded-xl border p-6 space-y-4">
                  <h3 className="font-semibold">Editar perfil</h3>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="edit-name">Nome</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-5">
                    <Label className="text-muted-foreground">Email</Label>
                    <span className="text-sm">{mockUser.email}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="gap-2">
                      <Check className="size-3.5" />
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setEditing(false)}
                    >
                      <X className="size-3.5" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-xl border">
                <div className="divide-y">
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="flex items-center gap-3 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      Email
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {mockUser.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="flex items-center gap-3 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      Membro desde
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {mockUser.createdAt.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="flex items-center gap-3 text-sm">
                      <Smartphone className="size-4 text-muted-foreground" />
                      Telefone
                    </span>
                    <span className="text-sm text-muted-foreground">
                      (11) 99999-9999
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm transition-colors hover:bg-accent/50"
                >
                  <span className="flex items-center gap-3">
                    <KeyRound className="size-4 text-muted-foreground" />
                    Alterar senha
                  </span>
                  <ChevronRight
                    className={`size-4 text-muted-foreground transition-transform ${showPasswordForm ? "rotate-90" : ""}`}
                  />
                </button>

                {showPasswordForm && (
                  <div className="space-y-4 border-t px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="current-pwd">Senha atual</Label>
                      <Input id="current-pwd" type="password" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="new-pwd">Nova senha</Label>
                      <div className="relative">
                        <Input
                          id="new-pwd"
                          type={showPassword ? "text" : "password"}
                          className="pr-9"
                        />
                        <button
                          type="button"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button size="sm">Alterar senha</Button>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "compras" && (
            <section className="space-y-4">
              {mockOrders.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  Nenhuma compra realizada ainda.
                </p>
              ) : (
                mockOrders.map((order) => {
                  const status = statusConfig[order.status]
                  return (
                    <div
                      key={order.id}
                      className="flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{order.id}</span>
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="size-3.5" />
                          {order.date.toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} item(ns)
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">
                          {order.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                        <Button variant="outline" size="sm" className="gap-2">
                          <History className="size-3.5" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </section>
          )}

          {activeTab === "enderecos" && (
            <section className="space-y-4">
              {mockAddresses.map((addr) => (
                <div key={addr.id} className="rounded-xl border p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span className="font-medium">{addr.label}</span>
                      {addr.isDefault && (
                        <Badge variant="secondary">Padrão</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" className="size-8">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="size-8">
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {addr.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.neighborhood} - {addr.city}, {addr.state} -{" "}
                    {addr.zip}
                  </p>

                  {!addr.isDefault && (
                    <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                      Definir como padrão
                    </Button>
                  )}
                </div>
              ))}

              <Button variant="outline" className="w-full gap-2">
                <Plus className="size-4" />
                Adicionar novo endereço
              </Button>
            </section>
          )}

          {activeTab === "seguranca" && (
            <section className="space-y-6">
              <div className="rounded-xl border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="size-5 text-primary" />
                  <h3 className="font-semibold">Autenticação</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <KeyRound className="size-3.5" />
                      JWT Token
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                    <span className="text-muted-foreground">Sessão ativa</span>
                    <span className="flex items-center gap-1.5 font-medium text-emerald-500">
                      <Check className="size-3.5" />
                      Sim
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                    <span className="text-muted-foreground">
                      Expira em
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="size-3.5" />
                      55 minutos
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="size-5 shrink-0 text-amber-500" />
                  <div className="text-sm">
                    <strong className="font-medium">
                      Nunca compartilhe seu token
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      Seu token JWT é como uma senha. Nunca o compartilhe com
                      ninguém, nem mesmo com suporte técnico.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Revogar todas as sessões
              </Button>
            </section>
          )}
        </main>
      </div>
    </MainLayout>
  )
}
