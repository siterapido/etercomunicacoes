"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Shield, Trash2, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PageTransition } from "@/components/ui/page-transition";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
}

const ROLES = ["admin", "manager", "designer", "writer"];
const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  manager: "Gerente",
  designer: "Designer",
  writer: "Redator",
};
const ROLE_COLORS: Record<string, string> = {
  admin: "text-crimson bg-crimson/10 border-crimson/20",
  manager: "text-brass bg-brass/10 border-brass/20",
  designer: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  writer: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

export default function AdminPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403) {
        setError("Acesso restrito a administradores.");
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setOpenRoleMenu(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch {
      /* ignore */
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Tem certeza? Esta ação removerá o usuário permanentemente.")) return;
    setDeletingId(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      /* ignore */
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const stats = ROLES.map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  }));

  if (error) {
    return (
      <PageTransition>
        <div className="px-6 py-12 md:px-16 lg:px-24">
          <div className="flex items-center gap-3 p-6 rounded-xl bg-crimson/10 border border-crimson/20 text-crimson max-w-md">
            <Shield className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <SectionHeader label="Admin" title="Gestão de Equipe" />

      {/* Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map(({ role, count }) => (
          <motion.div key={role} variants={fadeInUp}>
            <Card className="py-4 px-5">
              <p className="text-2xl font-bold text-marble">{count}</p>
              <p className="text-xs text-stone mt-1">{ROLE_LABELS[role]}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Users table */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-graphite">
          <div className="flex items-center gap-2 text-champagne">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{users.length} usuários</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 bg-charcoal border border-graphite rounded-lg text-sm text-marble placeholder:text-stone/50 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-brass border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-graphite">
            {filtered.map((user) => {
              const isMe = user.id === session?.user?.id;
              const isUpdating = updatingId === user.id;
              const isDeleting = deletingId === user.id;

              return (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 hover:bg-teal-light/30 transition-colors",
                    isMe && "bg-brass/5"
                  )}
                >
                  <Avatar name={user.name} imageUrl={user.avatarUrl} size="md" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-marble truncate">{user.name}</p>
                      {isMe && (
                        <span className="text-[10px] bg-brass/20 text-brass px-1.5 py-0.5 rounded-full">
                          você
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone truncate">{user.email}</p>
                  </div>

                  <div className="text-xs text-stone hidden md:block">
                    desde {format(new Date(user.createdAt), "MMM yyyy", { locale: ptBR })}
                  </div>

                  {/* Role selector */}
                  <div className="relative">
                    <button
                      onClick={() => !isMe && setOpenRoleMenu(openRoleMenu === user.id ? null : user.id)}
                      disabled={isMe || isUpdating}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                        ROLE_COLORS[user.role],
                        !isMe && "cursor-pointer hover:opacity-80",
                        isMe && "cursor-not-allowed opacity-70"
                      )}
                    >
                      {isUpdating ? (
                        <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : null}
                      {ROLE_LABELS[user.role]}
                      {!isMe && <ChevronDown className="h-3 w-3" />}
                    </button>

                    {openRoleMenu === user.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenRoleMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 w-40 bg-void border border-graphite rounded-lg shadow-lg z-50 overflow-hidden py-1">
                          {ROLES.map((role) => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(user.id, role)}
                              className={cn(
                                "w-full text-left px-4 py-2 text-xs hover:bg-teal-light transition-colors",
                                user.role === role ? "text-brass font-semibold" : "text-champagne"
                              )}
                            >
                              {ROLE_LABELS[role]}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Delete */}
                  {!isMe && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg text-stone hover:text-crimson hover:bg-crimson/10 transition-colors cursor-pointer"
                      title="Remover usuário"
                    >
                      {isDeleting ? (
                        <span className="h-4 w-4 rounded-full border-2 border-crimson border-t-transparent animate-spin block" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-stone text-sm">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        )}
      </Card>
      </motion.div>
    </div>
    </PageTransition>
  );
}
