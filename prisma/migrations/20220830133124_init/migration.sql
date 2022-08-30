-- CreateTable
CREATE TABLE "Users" (
    "userId" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "failedLoginCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Secretes" (
    "secretId" SERIAL NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Secretes_pkey" PRIMARY KEY ("secretId")
);

-- CreateIndex
CREATE INDEX "Users_username_idx" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
