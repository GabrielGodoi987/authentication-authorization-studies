import { ExternalLink } from "lucide-react"

const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gabriel-godoi-120770297/",
  },
  {
    label: "GitHub",
    href: "https://github.com/GabrielGodoi987",
  },
]

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Gabriel Godoi. Todos os direitos
          reservados.
        </p>

        <div className="flex items-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
