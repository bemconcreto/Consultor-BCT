import type { ComponentType } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import { redirect } from "next/navigation";
import { CheckCircle2, TrendingUp, BookOpen, Scale, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function CertificacaoPage() {
  const session = await getCurrentCorretor();
  if (!session) redirect("/");

  const corretor = await prisma.corretor.findUnique({
    where: { userId: session.userId },
  });

  const certificado = corretor?.statusCertificacao === "aprovado";

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">
          Por que se certificar Consultor BCT?
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 max-w-3xl leading-relaxed">
          A certificação BCT garante credibilidade, acesso a oportunidades exclusivas,
          maior taxa de conversão em vendas e reconhecimento oficial como consultor
          autorizado. Com a certificação, você terá materiais profissionais, treinamento
          especializado e prioridade em campanhas promocionais dentro do ecossistema Bem
          Concreto.
        </p>
      </div>

      {/* BLOCO PARA NÃO CERTIFICADO */}
      {!certificado && (
        <Card>
          <CardHeader>
            <CardTitle>Sua Certificação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#6B7280]">
              Você ainda não possui certificação ativa. Para liberar todos os benefícios,
              faça agora mesmo a certificação oficial BCT.
            </p>

            <Button asChild className="mt-4 bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85">
              <a href="https://certificacao.bemconcreto.com" target="_blank" rel="noreferrer">
                Tire seu certificado agora mesmo
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* BLOCO PARA CERTIFICADO */}
      {certificado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              Parabéns! Você é um Consultor Certificado BCT
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <p className="text-sm text-[#6B7280]">
              Seu status de consultor certificado está ativo. Agora você tem acesso a
              benefícios exclusivos e diretrizes avançadas para maximizar sua performance
              como consultor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoSection
                icon={TrendingUp}
                title="Como vender mais"
                text="Utilize seu link exclusivo, compartilhe materiais oficiais e acompanhe suas métricas no painel para otimizar sua performance."
              />
              <InfoSection
                icon={BookOpen}
                title="Boas práticas"
                text="Comunique-se sempre com clareza, utilize apenas materiais oficiais e mantenha uma relação transparente com seus clientes."
              />
              <InfoSection
                icon={Scale}
                title="Políticas do programa"
                text="Evite promessas de ganhos. Toda comunicação deve seguir as normas da Bem Concreto e diretrizes de publicidade do mercado imobiliário."
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoSection({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-[#101820]">{title}</h3>
      <p className="mt-1 text-sm text-[#6B7280] leading-relaxed">{text}</p>
    </div>
  );
}
