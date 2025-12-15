/*
  Warnings:

  - The primary key for the `doctor_specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `specialtyId` on the `doctor_specialties` table. All the data in the column will be lost.
  - Added the required column `specialtysId` to the `doctor_specialties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialtyId_fkey";

-- AlterTable
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_pkey",
DROP COLUMN "specialtyId",
ADD COLUMN     "specialtysId" TEXT NOT NULL,
ADD CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("specialtysId", "doctorId");

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtysId_fkey" FOREIGN KEY ("specialtysId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
