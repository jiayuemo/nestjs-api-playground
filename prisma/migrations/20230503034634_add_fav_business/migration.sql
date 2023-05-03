/*
  Warnings:

  - Added the required column `businessUuid` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "businessUuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessUuid_fkey" FOREIGN KEY ("businessUuid") REFERENCES "businesses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
