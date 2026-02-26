/*
  Warnings:

  - You are about to drop the `user_movie_interactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_movie_interactions" DROP CONSTRAINT "user_movie_interactions_user_id_fkey";

-- DropTable
DROP TABLE "user_movie_interactions";
