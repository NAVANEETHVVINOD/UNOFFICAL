-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STUDENT', 'PROFESSIONAL', 'ORGANIZER', 'TEACHER');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "userType" "UserType";
