-- CreateTable
CREATE TABLE "EmailLead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "page" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailLead_email_key" ON "EmailLead"("email");

-- CreateIndex
CREATE INDEX "EmailLead_source_createdAt_idx" ON "EmailLead"("source", "createdAt");

-- CreateIndex
CREATE INDEX "EmailLead_createdAt_idx" ON "EmailLead"("createdAt");
