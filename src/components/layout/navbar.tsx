"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, Settings, ChevronDown, Shield, Sparkles, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth/client";

interface NavbarProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
  };
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/projects", label: "Projetos" },
  { href: "/clients", label: "Clientes" },
  { href: "/approvals", label: "Aprovações" },
  { href: "/ai", label: "AI Studio", isAI: true },
];

export function Navbar({ user }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-3 flex items-center justify-between transition-all duration-300",
        scrolled
          ? "bg-[#1C2D3A]/95 backdrop-blur-xl shadow-lg border-b border-white/5"
          : "bg-[#1C2D3A] border-b border-white/8"
      )}
    >
      <Link href="/" className="no-underline flex items-center">
        <Image
          src="/logos/etercom-full.png"
          alt="Eter Comunicações"
          width={120}
          height={74}
          className="opacity-90 hover:opacity-100 transition-opacity"
          style={{ height: "36px", width: "auto" }}
          priority
        />
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-[#F5EAD4]/50 no-underline text-[12px] font-medium tracking-[0.12em] uppercase transition-colors relative flex items-center gap-1.5",
              "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#FF7700] after:transition-[width] after:duration-300 after:rounded-full",
              "hover:text-[#F5EAD4] hover:after:w-full",
              pathname === link.href && "text-[#F5EAD4] after:w-full"
            )}
          >
            {link.isAI && <Sparkles className="h-3 w-3 text-[#FF7700]" />}
            {link.label}
          </Link>
        ))}

        <div className="w-px h-5 bg-white/10" />

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Avatar name={user.name} imageUrl={user.avatarUrl} size="md" />
            <ChevronDown
              className={cn(
                "w-3 h-3 text-[#F5EAD4]/40 transition-transform",
                menuOpen && "rotate-180"
              )}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-void border border-graphite rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-graphite">
                  <p className="text-sm font-medium text-marble">{user.name}</p>
                  <p className="text-xs text-stone capitalize">{user.role}</p>
                </div>
                <div className="p-2">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-champagne hover:bg-teal-light rounded-md no-underline transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Configuracoes
                  </Link>
                  {(user.role === "admin" || user.role === "manager") && (
                    <Link
                      href="/approvals"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-champagne hover:bg-teal-light rounded-md no-underline transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <CheckSquare className="w-4 h-4" />
                      Aprovacoes
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-champagne hover:bg-teal-light rounded-md no-underline transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <div className="my-1 border-t border-graphite" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-champagne hover:bg-teal-light rounded-md w-full text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
