-- CreateTable
CREATE TABLE "ChallengeCodes" (
    "challengeCodeId" SERIAL NOT NULL,
    "challenge" TEXT NOT NULL,
    "requester" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "ChallengeCodes_pkey" PRIMARY KEY ("challengeCodeId")
);
