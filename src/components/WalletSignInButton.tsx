"use client";

import { useState } from "react";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";
import { useRouter } from "next/navigation";
import { prisma } from "../lib/prisma";
import { getAddress } from "ethers";

export default function WalletSignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConnect() {
    try {
      setError(null);
      setLoading(true);

      // 1) Verifica MetaMask
      if (typeof window === "undefined" || !(window as any).ethereum) {
        setError("Nenhuma carteira detectada. Instale MetaMask ou outra carteira Web3.");
        setLoading(false);
        return;
      }

      // 2) Inicializa provider versão ethers v6
      const provider = new BrowserProvider((window as any).ethereum);

      // 3) Solicita contas
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = (await signer.getAddress()).toLowerCase();

      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // 4) Busca nonce do backend
      const nonceRes = await fetch("/api/siwe/nonce");
      const { nonce } = await nonceRes.json();

      // 5) Monta mensagem SIWE
      const domain = window.location.host;
      const origin = window.location.origin;

const checksummedAddress = getAddress(address);

const siweMessage = new SiweMessage({
  domain,
  address: checksummedAddress,
  statement: "Entrar no Consultor-BCT assinando com sua carteira.",
  uri: origin,
  version: "1",
  chainId,
});

      const message = siweMessage.prepareMessage();

      // 6) Assinar SIWE
      const signature = await signer.signMessage(message);

      // 7) Validar no backend
      const verifyRes = await fetch("/api/siwe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature })
      });

      const verifyJson = await verifyRes.json();

if (!verifyJson || verifyJson.ok !== true) {
  console.error("Erro SIWE:", verifyJson);
  alert("Erro ao verificar login Web3.");
  return;
}

      router.push("/painel");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao conectar carteira");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={loading}
        style={{
          padding: "10px 18px",
          borderRadius: 8,
          background: "#101820",
          color: "white",
          fontWeight: "bold",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Conectando..." : "Conectar carteira (MetaMask)"}
      </button>

      {error && (
        <p style={{ color: "crimson", marginTop: 10, fontSize: 14 }}>
          {error}
        </p>
      )}
    </div>
  );
}