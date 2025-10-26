-- DropIndex
DROP INDEX "public"."users_tenantId_email_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "tenantId" DROP NOT NULL;
