/*
  Warnings:

  - You are about to drop the column `currencyNumber` on the `Country` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Country_currencyNumber_key";

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "currencyNumber";
