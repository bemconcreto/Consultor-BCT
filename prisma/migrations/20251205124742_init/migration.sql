-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corretor" (
    "id" SERIAL NOT NULL,
    "corretorId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "nome" TEXT,
    "cpf" TEXT,
    "endereco" JSONB,
    "creci" TEXT,
    "dadosBancarios" JSONB,
    "saldoDisponivel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldoPendente" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Corretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" SERIAL NOT NULL,
    "vendaId" TEXT NOT NULL,
    "corretorId" INTEGER NOT NULL,
    "imovelId" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "comissao" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "dataVenda" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saque" (
    "id" SERIAL NOT NULL,
    "corretorId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dadosBancarios" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Saque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Corretor_corretorId_key" ON "Corretor"("corretorId");

-- CreateIndex
CREATE UNIQUE INDEX "Corretor_userId_key" ON "Corretor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Venda_vendaId_key" ON "Venda"("vendaId");

-- AddForeignKey
ALTER TABLE "Corretor" ADD CONSTRAINT "Corretor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saque" ADD CONSTRAINT "Saque_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
