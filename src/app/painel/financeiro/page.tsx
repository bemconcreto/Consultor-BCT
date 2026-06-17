import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import { Wallet, Clock, CheckCircle2, ArrowDownToLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawForm from "@/components/WithdrawForm";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(s: Date) {
  return s.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
};

export default async function FinanceiroPage() {
  const session = await getCurrentCorretor();
  if (!session) redirect("/");

  const corretor = await prisma.corretor.findUnique({
    where: { userId: session.userId },
  });
  if (!corretor) redirect("/");

  const saques = await prisma.saque.findMany({
    where: { corretorId: corretor.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const totalPago = saques
    .filter((s) => s.status === "pago")
    .reduce((a, s) => a + s.valor, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Financeiro</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Acompanhe seus saldos e solicite saques das suas comissões.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Wallet,
            label: "Saldo disponível",
            value: fmt(corretor.saldoDisponivel),
            color: "text-[#CBA35C]",
            sub: "pronto para saque",
          },
          {
            icon: Clock,
            label: "Saldo pendente",
            value: fmt(corretor.saldoPendente),
            color: "text-amber-500",
            sub: "aguardando pagamento",
          },
          {
            icon: CheckCircle2,
            label: "Total já recebido",
            value: fmt(totalPago),
            color: "text-emerald-600",
            sub: "saques pagos",
          },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-10 h-10 rounded-xl bg-[#F7F8F9] border border-[#E5E7EB] flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#6B7280] font-medium">{k.label}</p>
                  <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{k.sub}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Solicitar Saque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-[#CBA35C]" />
            Solicitar Saque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WithdrawForm
            saldoDisponivel={corretor.saldoDisponivel}
            chavePix={corretor.chavePix ?? null}
          />
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Saques</CardTitle>
        </CardHeader>
        <CardContent>
          {saques.length === 0 ? (
            <p className="text-sm text-[#9CA3AF] text-center py-6">
              Nenhum saque solicitado ainda.
            </p>
          ) : (
            <div className="divide-y divide-[#E5E7EB]/60">
              {saques.map((s) => (
                <div key={s.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-bold text-[#101820]">{fmt(s.valor)}</span>
                    <span className="text-xs text-[#9CA3AF]">{fmtDate(s.createdAt)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    s.status === "pago"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-amber-50 border-amber-200 text-amber-600"
                  }`}>
                    {STATUS_LABEL[s.status] ?? s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
