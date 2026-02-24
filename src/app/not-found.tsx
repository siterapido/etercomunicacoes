import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-[family-name:var(--font-display)] text-[120px] leading-none font-bold text-graphite mb-2">
          404
        </h1>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-marble mb-4">
          Pagina nao encontrada
        </h2>
        <p className="text-sm text-stone mb-8 leading-relaxed">
          A pagina que voce esta procurando nao existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-brass text-white text-sm font-semibold tracking-[0.05em] rounded-lg hover:bg-navy transition-colors no-underline"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
