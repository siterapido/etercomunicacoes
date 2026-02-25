"use client";

import { useState, useRef } from "react";
import { Sparkles, Copy, Check, ChevronDown, Wand2, History, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const CONTENT_TYPES = [
  { value: "caption", label: "Legenda", emoji: "📱", desc: "Instagram, Facebook, LinkedIn" },
  { value: "script", label: "Roteiro", emoji: "🎬", desc: "Reels, TikTok, YouTube Shorts" },
  { value: "blog", label: "Artigo de Blog", emoji: "✍️", desc: "Conteúdo longo, SEO" },
  { value: "ad_copy", label: "Anúncio", emoji: "🎯", desc: "Google Ads, Meta Ads" },
  { value: "email", label: "Email", emoji: "📧", desc: "Marketing, Newsletter" },
  { value: "description", label: "Descrição", emoji: "📝", desc: "Produto, serviço, perfil" },
];

const TONES = [
  "Profissional",
  "Descontraído",
  "Empolgante",
  "Informativo",
  "Persuasivo",
  "Inspirador",
  "Urgente",
  "Storytelling",
];

interface HistoryItem {
  id: string;
  contentType: string;
  prompt: string;
  result: string;
  createdAt: string;
}

export default function AIStudioPage() {
  const [contentType, setContentType] = useState("caption");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Profissional");
  const [variations, setVariations] = useState(1);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    setTokensUsed(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, prompt, tone, variations }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
        setTokensUsed(data.tokensUsed);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch {
      setError("Erro de conexão. Verifique a API.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/ai/generate");
      const data = await res.json();
      if (!data.error) setHistory(data);
    } catch { /* ignore */ }
    finally { setHistoryLoading(false); }
  };

  const handleShowHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory && history.length === 0) loadHistory();
  };

  const selectedType = CONTENT_TYPES.find((t) => t.value === contentType);

  return (
    <PageTransition>
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader
          label="AI Studio"
          title="Geração de Conteúdo com IA"
          className="mb-0"
        />
        <button
          onClick={handleShowHistory}
          className="flex items-center gap-2 text-sm text-stone hover:text-brass transition-colors cursor-pointer"
        >
          <History className="h-4 w-4" />
          {showHistory ? "Fechar histórico" : "Histórico"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Config panel */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="xl:col-span-2 space-y-6"
        >
          {/* Content type selector */}
          <motion.div variants={fadeInUp}>
          <Card>
            <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-4">
              Tipo de conteúdo
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setContentType(type.value)}
                  className={cn(
                    "flex flex-col gap-1 p-3 rounded-xl border text-left transition-all cursor-pointer",
                    contentType === type.value
                      ? "bg-brass/10 border-brass text-brass"
                      : "bg-charcoal border-graphite text-stone hover:border-brass/40 hover:text-champagne"
                  )}
                >
                  <span className="text-xl">{type.emoji}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                  <span className="text-xs opacity-70">{type.desc}</span>
                </button>
              ))}
            </div>
          </Card>
          </motion.div>

          {/* Prompt */}
          <motion.div variants={fadeInUp}>
          <Card>
            <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-3">
              Descreva o que você quer criar
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                contentType === "caption"
                  ? "Ex: Legenda para post de lançamento de produto de skincare premium, focando nos benefícios naturais..."
                  : contentType === "script"
                  ? "Ex: Roteiro de 30s para Reels apresentando nova coleção de verão da marca X..."
                  : contentType === "blog"
                  ? "Ex: Artigo sobre tendências de design para 2026 no segmento de arquitetura de interiores..."
                  : "Descreva o contexto, objetivo, produto/serviço e público-alvo..."
              }
              rows={5}
              className="w-full px-4 py-3 bg-charcoal border border-graphite rounded-xl text-marble placeholder:text-stone/50 text-sm focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 resize-none mb-4"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Tone */}
              <div className="flex-1">
                <p className="text-xs font-medium text-stone mb-2">Tom de voz</p>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 bg-charcoal border border-graphite rounded-lg text-sm text-marble focus:outline-none focus:border-brass appearance-none cursor-pointer"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone pointer-events-none" />
                </div>
              </div>

              {/* Variations */}
              <div>
                <p className="text-xs font-medium text-stone mb-2">Variações</p>
                <div className="flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setVariations(n)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium border transition-all cursor-pointer",
                        variations === n
                          ? "bg-brass text-white border-brass"
                          : "bg-charcoal text-stone border-graphite hover:border-brass/40"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
          <Button
            onClick={generate}
            loading={loading}
            disabled={!prompt.trim()}
            size="lg"
            className="w-full"
          >
            <Wand2 className="h-5 w-5" />
            {loading ? "Gerando..." : `Gerar ${selectedType?.label}`}
          </Button>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
          {(result || error) && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
            >
            <Card className="mt-2">
              {error ? (
                <div className="text-crimson text-sm">
                  <p className="font-medium mb-1">Erro na geração</p>
                  <p className="text-xs">{error}</p>
                  {error.includes("OPENROUTER_API_KEY") && (
                    <p className="text-xs mt-2 text-stone">
                      Adicione <code className="bg-charcoal px-1 rounded">OPENROUTER_API_KEY=sk-or-...</code> no arquivo <code className="bg-charcoal px-1 rounded">.env.local</code>
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brass" />
                      <span className="text-xs font-semibold tracking-widest uppercase text-brass">
                        Resultado
                      </span>
                      {tokensUsed && (
                        <span className="text-xs text-stone">({tokensUsed} tokens)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setResult(""); setPrompt(""); }}
                        className="flex items-center gap-1 text-xs text-stone hover:text-marble transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Limpar
                      </button>
                      <button
                        onClick={copyResult}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brass/30 text-xs text-brass hover:bg-brass hover:text-white transition-colors cursor-pointer"
                      >
                        {copied ? <><Check className="h-3.5 w-3.5" /> Copiado!</> : <><Copy className="h-3.5 w-3.5" /> Copiar</>}
                      </button>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-champagne leading-relaxed">
                    {result}
                  </div>
                </>
              )}
            </Card>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={fadeInUp}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-brass" />
              <h3 className="text-sm font-semibold text-champagne">Dicas de uso</h3>
            </div>
            <ul className="space-y-3 text-xs text-stone">
              <li className="flex gap-2">
                <span className="text-brass font-bold shrink-0">1.</span>
                Quanto mais contexto você fornecer, melhor será o resultado
              </li>
              <li className="flex gap-2">
                <span className="text-brass font-bold shrink-0">2.</span>
                Inclua o tom de voz da marca e público-alvo
              </li>
              <li className="flex gap-2">
                <span className="text-brass font-bold shrink-0">3.</span>
                Use variações para comparar e escolher a melhor versão
              </li>
              <li className="flex gap-2">
                <span className="text-brass font-bold shrink-0">4.</span>
                Edite o resultado gerado antes de publicar
              </li>
            </ul>
          </Card>
          </motion.div>

          {showHistory && (
            <Card>
              <h3 className="text-sm font-semibold text-champagne mb-4">Histórico recente</h3>
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 rounded-full border-2 border-brass border-t-transparent animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-stone text-center py-4">Nenhuma geração ainda</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item) => {
                    const type = CONTENT_TYPES.find((t) => t.value === item.contentType);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setContentType(item.contentType);
                          setPrompt(item.prompt);
                          setResult(item.result);
                        }}
                        className="w-full text-left p-3 rounded-lg bg-charcoal hover:bg-teal-light transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{type?.emoji}</span>
                          <span className="text-xs font-medium text-champagne">{type?.label}</span>
                        </div>
                        <p className="text-xs text-stone truncate">{item.prompt}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          )}

          <motion.div variants={fadeInUp}>
          <Card className="bg-brass/5 border-brass/20">
            <div className="text-center">
              <p className="text-xs font-semibold text-brass mb-1">Status da IA</p>
              <p className="text-xs text-stone">
                Powered by OpenRouter
              </p>
              <p className="text-xs text-stone/60 mt-2">
                Configure OPENROUTER_API_KEY para ativar
              </p>
            </div>
          </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </PageTransition>
  );
}
