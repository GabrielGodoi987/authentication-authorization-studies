import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => navigate("/login", { replace: true }), 2000);
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-muted p-4">
        <LogOut className="size-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">Sessão encerrada</h2>
      <p className="text-center text-sm text-muted-foreground max-w-sm">
        É hora de descansar os olhos e focar no que realmente importa! Pise na
        grama e respire ar fresco, é melhor um dia difícil com saúde do que um
        fácil em um leito do hospital, rs
      </p>
      <p className="text-xs text-muted-foreground">
        Redirecionando para o login...
      </p>
    </div>
  );
}
