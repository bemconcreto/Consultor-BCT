"use client";

import { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faq = [
  {
    q: "Como faço para me tornar um consultor Bem Concreto?",
    a: "Basta realizar a certificação oficial no portal certificacao.bemconcreto.com e seguir as etapas solicitadas."
  },
  {
    q: "A certificação é obrigatória?",
    a: "Sim. Apenas consultores certificados podem indicar clientes e receber comissões pelos projetos tokenizados."
  },
  {
    q: "Como recebo minhas comissões?",
    a: "As comissões são creditadas diretamente no seu saldo disponível após a confirmação da venda."
  },
  {
    q: "Quanto tempo leva para uma venda ser aprovada?",
    a: "O prazo varia conforme a análise de documentos e confirmação de pagamento, em média 1 a 3 dias úteis."
  },
  {
    q: "Onde encontro meu link de indicação?",
    a: "Seu link exclusivo está disponível no painel, na área de indicações."
  },
  {
    q: "Posso indicar alguém que já conhece a Bem Concreto?",
    a: "Sim, desde que a venda seja concluída a partir do seu link ou registrada como sua indicação."
  },
  {
    q: "Como funciona a remuneração do consultor?",
    a: "Você recebe um percentual direto sobre o valor vendido pelo cliente indicado, conforme tabela vigente."
  },
  {
    q: "Posso sacar meu saldo a qualquer momento?",
    a: "Sim, desde que o saldo esteja disponível e o valor mínimo de saque seja atendido."
  },
  {
    q: "Qual o prazo de saque?",
    a: "Após a solicitação, o saque é processado em até 1 dia útil."
  },
  {
    q: "Onde acompanho minhas vendas?",
    a: "No painel principal, você encontra sua lista de vendas e suas comissões detalhadas."
  },
  {
    q: "Indicação e venda são a mesma coisa?",
    a: "Não. Indicação é quando alguém entra pelo seu link. Venda é quando essa pessoa compra algo."
  },
  {
    q: "Como funciona o processo de tokenização?",
    a: "Os ativos são divididos em frações digitais (tokens), permitindo que investidores comprem partes de projetos imobiliários."
  },
  {
    q: "O que é o BEM?",
    a: "É o token de utilidade da Bem Concreto, utilizado para participação nos projetos tokenizados."
  },
  {
    q: "Os projetos são seguros?",
    a: "Sim, todos passam por auditoria jurídica, registro e são lastreados em ativos reais."
  },
  {
    q: "Como acompanho os status das minhas indicações?",
    a: "Na aba de indicações, você encontra todos os status separados por aprovadas, pendentes e em análise."
  },
  {
    q: "O que fazer se meu indicado não aparece no painel?",
    a: "Peça que ele confirme se acessou o link corretamente e, se necessário, fale com nosso suporte."
  },
  {
    q: "Como altero meus dados pessoais?",
    a: "Em breve o painel terá essa funcionalidade. Por enquanto, solicite via suporte."
  },
  {
    q: "Como sei se já estou certificado?",
    a: "Acesse a aba Certificação. Seu status aparecerá no topo da página."
  },
  {
    q: "Posso vender para qualquer pessoa?",
    a: "Sim. Basta utilizar seu link de indicação ou registrar uma indicação manualmente quando disponível."
  },
  {
    q: "Qual o canal oficial de suporte?",
    a: "O suporte é feito via WhatsApp através do botão abaixo."
  }
];

export default function SuportePage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Título */}
      <div>
        <h1 className="text-3xl font-semibold text-bc-light">Suporte</h1>
        <p className="text-bc-light/80 mt-2">
          Tire suas dúvidas ou fale diretamente com nosso time.
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        {faq.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/10 border border-white/10 rounded-xl p-5 cursor-pointer"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-bc-light">{item.q}</h3>
              {open === idx ? (
                <ChevronUp className="text-bc-light" />
              ) : (
                <ChevronDown className="text-bc-light" />
              )}
            </div>

            {open === idx && (
              <p className="text-bc-light/70 mt-3 leading-relaxed">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* WHATSAPP BUTTON */}
      <div className="text-center pt-6">
        <p className="text-bc-light/80 mb-3">Precisa de ajuda personalizada?</p>

        <Link
          href="https://wa.me/5511975967575"
          target="_blank"
          className="
            inline-flex items-center gap-3 px-8 py-4 rounded-xl
            bg-green-600 hover:bg-green-500 text-white font-semibold
            shadow-lg transition
          "
        >
          <MessageCircle size={22} /> Falar com o suporte
        </Link>
      </div>
    </div>
  );
}