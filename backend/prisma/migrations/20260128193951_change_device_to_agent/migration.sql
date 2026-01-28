/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `Metric` table. All the data in the column will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `agentId` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentId` to the `Metric` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Metric" DROP CONSTRAINT "Metric_deviceId_fkey";

-- DropIndex
DROP INDEX "Metric_deviceId_timestamp_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "deviceId",
ADD COLUMN     "agentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Metric" DROP COLUMN "deviceId",
ADD COLUMN     "agentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Device";

-- DropEnum
DROP TYPE "DeviceStatus";

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "agentToken" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_agentToken_key" ON "Agent"("agentToken");

-- CreateIndex
CREATE INDEX "Metric_agentId_timestamp_idx" ON "Metric"("agentId", "timestamp" DESC);

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
