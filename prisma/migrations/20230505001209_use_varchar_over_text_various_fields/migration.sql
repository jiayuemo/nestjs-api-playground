/*
  Warnings:

  - You are about to alter the column `businessUuid` on the `geospatial_indexes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `favBusinessUuid` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `userUuid` on the `visits` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `businessUuid` on the `visits` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "geospatial_indexes" DROP CONSTRAINT "geospatial_indexes_businessUuid_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_favBusinessUuid_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_businessUuid_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_userUuid_fkey";

-- AlterTable
ALTER TABLE "geospatial_indexes" ALTER COLUMN "businessUuid" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "favBusinessUuid" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "visits" ALTER COLUMN "userUuid" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "businessUuid" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_favBusinessUuid_fkey" FOREIGN KEY ("favBusinessUuid") REFERENCES "businesses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_businessUuid_fkey" FOREIGN KEY ("businessUuid") REFERENCES "businesses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geospatial_indexes" ADD CONSTRAINT "geospatial_indexes_businessUuid_fkey" FOREIGN KEY ("businessUuid") REFERENCES "businesses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
