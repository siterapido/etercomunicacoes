export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4">
      <div className="mb-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[0.3em] text-marble text-center">
          E T E R<span className="text-brass">.</span>
        </h1>
        <p className="text-xs text-stone tracking-[0.2em] uppercase text-center mt-2">
          Comunicações
        </p>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
