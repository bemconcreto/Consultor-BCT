export default function ImovelDetalhesModal({ imovel, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold">{imovel.nome}</h2>
        <p className="text-gray-600 mt-1">{imovel.descricaoCurta}</p>

        <img
          src={imovel.imagem}
          className="rounded-lg mt-4"
          alt={imovel.nome}
        />

        <div className="mt-6 space-y-2 text-gray-700">
          <p><strong>Cidade:</strong> {imovel.cidade}</p>
          <p><strong>Status:</strong> {imovel.status}</p>
          <p><strong>Total tokenizado:</strong> {imovel.tokenTotal}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}