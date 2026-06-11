import { QueryProvider } from "@/components/query-provider"
import { Router } from "@/router"

export default function App() {
  return (
    <QueryProvider>
      <Router />
    </QueryProvider>
  )
}
