"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Shield, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const panelVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
};

type Tab = "profile" | "password" | "notifications" | "security";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "password", label: "Senha", icon: Lock },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "security", label: "Segurança", icon: Shield },
];

interface NotifPrefs {
  emailOnApproval: boolean;
  emailOnComment: boolean;
  emailOnAssign: boolean;
  emailOnDeadline: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { data: session } = authClient.useSession();

  // Profile
  const [name, setName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    emailOnApproval: true,
    emailOnComment: true,
    emailOnAssign: true,
    emailOnDeadline: true,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    // Load notification prefs
    fetch("/api/user/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setNotifPrefs(data);
      })
      .catch(() => {});
  }, [session]);

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const d = await res.json();
        setProfileError(d.error ?? "Falha ao salvar");
      } else {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch {
      setProfileError("Erro de conexão");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    setPasswordLoading(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError("Senha atual incorreta ou erro ao alterar");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotifSave = async () => {
    setNotifLoading(true);
    setNotifSuccess(false);
    try {
      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifPrefs),
      });
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch {
      /* ignore */
    } finally {
      setNotifLoading(false);
    }
  };

  const toggleNotif = (key: keyof NotifPrefs) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const roleLabels: Record<string, string> = {
    admin: "Administrador",
    manager: "Gerente",
    designer: "Designer",
    writer: "Redator",
  };

  return (
    <PageTransition>
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <SectionHeader label="Configurações" title="Gerencie sua conta" />

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl">
        {/* Sidebar tabs */}
        <div className="w-full md:w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left",
                  activeTab === id
                    ? "bg-brass text-white"
                    : "text-stone hover:text-marble hover:bg-teal-light"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div key="profile" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
            <Card>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-marble mb-6">
                Informações do Perfil
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-5 pb-5 border-b border-graphite">
                  <div className="h-16 w-16 rounded-full bg-brass/20 flex items-center justify-center text-2xl font-bold text-brass">
                    {name.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-marble">{name || "Usuário"}</p>
                    <p className="text-xs text-stone mt-0.5">{session?.user?.email}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brass/12 px-2.5 py-0.5 text-xs font-medium text-champagne">
                      {roleLabels[session?.user?.role ?? "designer"] ?? session?.user?.role}
                    </span>
                  </div>
                </div>

                <Input
                  id="name"
                  label="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-widest text-stone">
                    Email
                  </label>
                  <input
                    disabled
                    value={session?.user?.email ?? ""}
                    className="w-full h-11 px-4 bg-charcoal/50 border border-graphite rounded-lg text-stone font-[family-name:var(--font-body)] text-base cursor-not-allowed"
                  />
                  <p className="text-xs text-stone/60">O email não pode ser alterado</p>
                </div>

                {profileError && (
                  <p className="text-sm text-crimson">{profileError}</p>
                )}

                <Button
                  onClick={handleProfileSave}
                  loading={profileLoading}
                  className={cn(profileSuccess && "bg-emerald")}
                >
                  {profileSuccess ? (
                    <><Check className="h-4 w-4" /> Salvo!</>
                  ) : "Salvar alterações"}
                </Button>
              </div>
            </Card>
            </motion.div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <motion.div key="password" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
            <Card>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-marble mb-6">
                Alterar Senha
              </h3>
              <div className="space-y-5">
                <Input
                  id="current-password"
                  type="password"
                  label="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Input
                  id="new-password"
                  type="password"
                  label="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
                <Input
                  id="confirm-password"
                  type="password"
                  label="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  error={confirmPassword && newPassword !== confirmPassword ? "Senhas não coincidem" : undefined}
                />

                {passwordError && (
                  <p className="text-sm text-crimson">{passwordError}</p>
                )}

                <Button
                  onClick={handlePasswordChange}
                  loading={passwordLoading}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                  className={cn(passwordSuccess && "bg-emerald")}
                >
                  {passwordSuccess ? (
                    <><Check className="h-4 w-4" /> Senha alterada!</>
                  ) : "Alterar senha"}
                </Button>

                <div className="pt-4 border-t border-graphite">
                  <h4 className="text-sm font-medium text-champagne mb-3">Dicas de segurança</h4>
                  <ul className="space-y-2 text-xs text-stone">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-brass" />
                      Use no mínimo 8 caracteres
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-brass" />
                      Combine letras maiúsculas, minúsculas, números e símbolos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-brass" />
                      Não reutilize senhas de outros serviços
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div key="notifications" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
            <Card>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-marble mb-6">
                Notificações por Email
              </h3>
              <div className="space-y-4">
                {[
                  { key: "emailOnApproval" as keyof NotifPrefs, label: "Aprovações", desc: "Quando um cliente aprova ou solicita alterações" },
                  { key: "emailOnComment" as keyof NotifPrefs, label: "Comentários", desc: "Quando alguém comenta em suas tarefas" },
                  { key: "emailOnAssign" as keyof NotifPrefs, label: "Atribuições", desc: "Quando uma tarefa é atribuída a você" },
                  { key: "emailOnDeadline" as keyof NotifPrefs, label: "Prazos", desc: "Alertas de tarefas com deadline próximo" },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-4 border-b border-graphite last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-champagne">{label}</p>
                      <p className="text-xs text-stone mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(key)}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                        notifPrefs[key] ? "bg-brass" : "bg-graphite"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200",
                          notifPrefs[key] ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  onClick={handleNotifSave}
                  loading={notifLoading}
                  className={cn(notifSuccess && "bg-emerald")}
                >
                  {notifSuccess ? (
                    <><Check className="h-4 w-4" /> Salvo!</>
                  ) : "Salvar preferências"}
                </Button>
              </div>
            </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div key="security" variants={panelVariants} initial="hidden" animate="visible" exit="exit">
            <Card>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-marble mb-6">
                Segurança
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-brass/5 border border-brass/20">
                  <Shield className="h-5 w-5 text-brass mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-champagne">Conta protegida</p>
                    <p className="text-xs text-stone mt-1">
                      Sua conta está ativa e autenticada. Altere sua senha regularmente para manter a segurança.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-champagne mb-3">Suas permissões</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Projetos", value: session?.user?.role === "admin" || session?.user?.role === "manager" ? "Criar, editar, visualizar" : "Somente visualizar" },
                      { label: "Tarefas", value: session?.user?.role === "admin" || session?.user?.role === "manager" ? "Total" : "Editar e visualizar" },
                      { label: "Clientes", value: session?.user?.role === "admin" ? "Total" : session?.user?.role === "manager" ? "Criar, editar, visualizar" : "Somente visualizar" },
                      { label: "Usuários", value: session?.user?.role === "admin" ? "Total" : "Somente visualizar" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm py-2 border-b border-graphite last:border-0">
                        <span className="text-stone">{label}</span>
                        <span className="text-champagne">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
