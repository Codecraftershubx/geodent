/*
  Warnings:

  - The values [IMAGE] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Flat` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `School` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `Campus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('DOCX', 'PDF', 'VIDEO');
ALTER TABLE "Document" ALTER COLUMN "type" TYPE "DocumentType_new" USING ("type"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "addressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Campus" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Flat" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "postalCode",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressId" TEXT;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "number" INTEGER,
    "poBox" INTEGER,
    "zip" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_serial_key" ON "Address"("serial");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flat" ADD CONSTRAINT "Flat_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
