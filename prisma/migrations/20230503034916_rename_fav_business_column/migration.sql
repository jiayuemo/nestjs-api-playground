/*
  Warnings:

  - You are about to drop the column `businessUuid` on the `users` table. All the data in the column will be lost.
  - Added the required column `favBusinessUuid` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_businessUuid_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "businessUuid",
ADD COLUMN     "favBusinessUuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_favBusinessUuid_fkey" FOREIGN KEY ("favBusinessUuid") REFERENCES "businesses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
