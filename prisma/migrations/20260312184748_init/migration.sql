-- CreateTable
CREATE TABLE "RelatedPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RelatedPost_pkey" PRIMARY KEY ("id")
);
