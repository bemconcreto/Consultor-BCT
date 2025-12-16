-- DropIndex
DROP INDEX "Indicacao_accountId_key";

-- AlterTable
ALTER TABLE "Indicacao" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pendente';
