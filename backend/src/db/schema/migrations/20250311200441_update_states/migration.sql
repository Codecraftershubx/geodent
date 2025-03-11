/*
  Warnings:

  - A unique constraint covering the columns `[countryId]` on the table `State` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "State_countryId_key" ON "State"("countryId");
