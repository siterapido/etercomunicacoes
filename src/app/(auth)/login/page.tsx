"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      console.log("SIGN_IN_RESULT", JSON.stringify(result));

      if (result.error) {
        setError("Email ou senha incorretos.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-8">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-marble mb-8 text-center">
        Entrar
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="password"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-crimson text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>

      <p className="text-sm text-stone text-center mt-6">
        Não tem conta?{" "}
        <Link
          href="/register"
          className="text-brass hover:text-champagne transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </Card>
  );
}
