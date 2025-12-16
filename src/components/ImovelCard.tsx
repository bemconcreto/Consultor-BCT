import { useState } from "react";
import ImovelDetalhesModal from "./ImovelDetalhesModal";

export default function ImovelCard({ imovel }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
        onClick={() => setOpen(true)}
      >
        <img
          src={imovel.imagem}
          className="h-44 w-full object-cover"
          alt={imovel.nome}
        />

        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">{imovel.nome}</h2>
          <p className="text-gray-600 text-sm">{imovel.cidade}</p>

          <div className="mt-3">
            <span className="px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700">
              {imovel.status}
            </span>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-emerald-600 h-2.5 rounded-full"
                style={{ width: `${imovel.percentualDisponivel}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Disponível: {imovel.percentualDisponivel}%
            </p>
          </div>
        </div>
      </div>

      {open && <ImovelDetalhesModal imovel={imovel} onClose={() => setOpen(false)} />}
    </>
  );
}