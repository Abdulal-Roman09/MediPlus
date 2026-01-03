/*
  Warnings:

  - You are about to drop the column `icon` on the `specialties` table. All the data in the column will be lost.
  - Added the required column `file` to the `specialties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "specialties" DROP COLUMN "icon",
ADD COLUMN     "file" TEXT NOT NULL;
