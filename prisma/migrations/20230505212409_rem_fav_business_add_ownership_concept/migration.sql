/*
  Warnings:

  - You are about to drop the column `favBusinessUuid` on the `users` table. All the data in the column will be lost.
  - Added the required column `ownerUuid` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_favBusinessUuid_fkey";

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "ownerUuid" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "favBusinessUuid",
ADD COLUMN     "displayName" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
