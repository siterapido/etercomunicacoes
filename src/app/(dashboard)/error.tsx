"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-crimson/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-crimson" />
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-marble mb-3">
          Algo deu errado
        </h2>
        <p className="text-sm text-stone mb-8 leading-relaxed">
          Ocorreu um erro inesperado. Tente recarregar a pagina ou volte mais tarde.
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
