import { Elysia } from "elysia";
import { auth } from "../auth";
import { movieDiscoverDto, movieInteractDto, movieDetailsDto } from "./dtos";
import { MoviesService } from "./service";

const app = new Elysia({ prefix: "/movies", tags: ["Movies"] })
    .get(
        "/discover",
        async ({ query }) => {
            const result = await MoviesService.discover(query);
            return result;
        },
        movieDiscoverDto, // dtos contains Elysia validation
    )
    .use(auth())
    .get(
        "/interactions",
        async ({ user }) => {
            // Updated to fetch interactions with details
            const interactions = await MoviesService.getInteractionsWithDetails(user.id);
            return interactions;
        }
    )
    .post(
        "/:tmdbMovieId/interact",
        async ({ params, body, user }) => {
            const interaction = await MoviesService.interact(user.id, params.tmdbMovieId, body);
            return interaction;
        },
        movieInteractDto,
    )
    .get(
        "/:id",
        async ({ params }) => {
            const result = await MoviesService.getMovieById(params.id);
            return result;
        },
        movieDetailsDto,
    );

export default app;
