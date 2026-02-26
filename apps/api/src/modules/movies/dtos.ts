import { t } from 'elysia';

export const movieDiscoverDto = {
  query: t.Object({
    mood: t.Optional(t.String()),
    maxDuration: t.Optional(t.Numeric()),
    page: t.Optional(t.Numeric())
  })
};

export const movieInteractDto = {
  body: t.Object({
    isWatched: t.Boolean(),
    rating: t.Optional(t.Numeric({ minimum: 1, maximum: 5 }))
  }),
  params: t.Object({
    tmdbMovieId: t.Numeric()
  })
};

export const movieDetailsDto = {
  params: t.Object({
    id: t.Numeric()
  })
};
