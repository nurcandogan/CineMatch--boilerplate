-- CreateTable
CREATE TABLE "user_movie_interactions" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "tmdb_movie_id" INTEGER NOT NULL,
    "is_watched" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_movie_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_movie_interactions_user_id_idx" ON "user_movie_interactions"("user_id");

-- CreateIndex
CREATE INDEX "user_movie_interactions_tmdb_movie_id_idx" ON "user_movie_interactions"("tmdb_movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_movie_interactions_user_id_tmdb_movie_id_key" ON "user_movie_interactions"("user_id", "tmdb_movie_id");

-- AddForeignKey
ALTER TABLE "user_movie_interactions" ADD CONSTRAINT "user_movie_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
