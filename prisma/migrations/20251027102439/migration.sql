/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `tenants` table. All the data in the column will be lost.
  - The `tier` column on the `tenants` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TenantTier" AS ENUM ('FREE', 'STARTER', 'PRO', 'ENTERPRISE');

-- DropIndex
DROP INDEX "public"."tenants_stripeCustomerId_key";

-- DropIndex
DROP INDEX "public"."tenants_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "tier",
ADD COLUMN     "tier" "TenantTier" NOT NULL DEFAULT 'STARTER';
