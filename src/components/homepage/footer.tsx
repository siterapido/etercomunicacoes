export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-graphite mt-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <p className="font-[family-name:var(--font-display)] text-base font-bold tracking-[0.3em] text-marble">
          E T E R<span className="text-brass">.</span>
        </p>

        <p className="text-[11px] text-stone tracking-wider">
          &copy; {currentYear} Eter Comunicacoes. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
