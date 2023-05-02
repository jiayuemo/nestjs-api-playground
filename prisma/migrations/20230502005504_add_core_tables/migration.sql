-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'OWNER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BASIC',

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "visits" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "highlight" JSONB NOT NULL,
    "userUuid" TEXT NOT NULL,
    "businessUuid" TEXT NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "geospatial_indexes" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "location" VARCHAR(255) NOT NULL,
    "businessUuid" TEXT NOT NULL,

    CONSTRAINT "geospatial_indexes_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "businesses" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "geospatial_indexes_businessUuid_key" ON "geospatial_indexes"("businessUuid");

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_businessUuid_fkey" FOREIGN KEY ("businessUuid") REFERENCES "businesses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geospatial_indexes" ADD CONSTRAINT "geospatial_indexes_businessUuid_fkey" FOREIGN KEY ("businessUuid") REFERENCES "businesses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
