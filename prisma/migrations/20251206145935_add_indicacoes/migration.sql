/*
  Warnings:

  - Made the column `corretorId` on table `Corretor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Corretor" ALTER COLUMN "corretorId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Indicacao" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "consultorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Indicacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Indicacao_accountId_key" ON "Indicacao"("accountId");

-- AddForeignKey
ALTER TABLE "Indicacao" ADD CONSTRAINT "Indicacao_consultorId_fkey" FOREIGN KEY ("consultorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
