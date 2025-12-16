import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import Link from "next/link";

export default async function CertificacaoPage() {
  const session = await getCurrentCorretor();
  if (!session) return null;

  const corretor = await prisma.corretor.findUnique({
    where: { userId: session.userId },
  });

  const certificado = corretor?.statusCertificacao === "aprovado";

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      {/* Título principal */}
      <div>
        <h1 className="text-3xl font-semibold text-bc-light">
          Por que se certificar Consultor BCT?
        </h1>
        <p className="text-bc-light/80 mt-3 leading-relaxed">
          A certificação BCT garante credibilidade, acesso a oportunidades exclusivas,
          maior taxa de conversão em vendas e reconhecimento oficial como consultor autorizado. 
          Com a certificação, você terá materiais profissionais, treinamento especializado e 
          prioridade em campanhas promocionais dentro do ecossistema Bem Concreto.
        </p>
      </div>

      {/* BLOCO PARA NÃO CERTIFICADO */}
      {!certificado && (
        <div className="bg-white/10 p-8 rounded-2xl border border-white/10 shadow-md">
          
          <h2 className="text-2xl font-semibold text-bc-light">Sua Certificação</h2>
          <p className="text-bc-light/70 mt-2">
            Você ainda não possui certificação ativa. Para liberar todos os benefícios,
            faça agora mesmo a certificação oficial BCT.
          </p>

          <Link
            href="https://certificacao.bemconcreto.com"
            target="_blank"
            className="
              inline-block mt-6 px-8 py-3 rounded-xl text-lg font-semibold
              bg-bc-brown4 hover:bg-bc-brown3 transition text-white shadow-lg
            "
          >
            TIRE SEU CERTIFICADO AGORA MESMO
          </Link>

        </div>
      )}

      {/* BLOCO PARA CERTIFICADO */}
      {certificado && (
        <div className="bg-white/10 p-8 rounded-2xl border border-white/10 shadow-md space-y-6">

          <h2 className="text-2xl font-semibold text-green-400">
            ✔ Parabéns! Você é um Consultor Certificado BCT
          </h2>

          <p className="text-bc-light/80">
            Seu status de consultor certificado está ativo. Agora você tem acesso a benefícios
            exclusivos e diretrizes avançadas para maximizar sua performance como consultor.
          </p>

          <div className="space-y-4 pt-4 text-bc-light/90">

            <div>
              <h3 className="text-xl font-semibold">📈 Como vender mais</h3>
              <p className="mt-1">
                Utilize seu link exclusivo, compartilhe materiais oficiais e acompanhe suas métricas
                no painel para otimizar sua performance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">📘 Boas práticas</h3>
              <p className="mt-1">
                Comunique-se sempre com clareza, utilize apenas materiais oficiais 
                e mantenha uma relação transparente com seus clientes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">⚖️ Políticas do programa</h3>
              <p className="mt-1">
                Evite promessas de ganhos. Toda comunicação deve seguir as normas da Bem Concreto
                e diretrizes de publicidade do mercado imobiliário.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}