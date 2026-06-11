import { type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { headerItems, headerItemsAuthenticated } from "./header-items/items"

export default function MainLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

  const items = isAuthenticated ? headerItemsAuthenticated : headerItems

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-center px-4">
          <nav className="flex items-center gap-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.link

              return (
                <Link
                  key={item.link}
                  to={item.link}
                  data-active={isActive}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                >
                  <Icon className="size-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
