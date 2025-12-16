export default function LayoutImoveis({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Cabeçalho da página */}

      {/* Conteúdo */}
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}