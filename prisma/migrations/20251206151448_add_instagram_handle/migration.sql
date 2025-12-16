/*
  Warnings:

  - A unique constraint covering the columns `[instagramHandle]` on the table `Corretor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Corretor" ADD COLUMN     "instagramHandle" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Corretor_instagramHandle_key" ON "Corretor"("instagramHandle");
