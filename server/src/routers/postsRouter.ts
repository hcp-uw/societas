import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "../trpc";

export const postsRouter = router({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.db.post.findMany({
            take: 5
        });
        return posts;
    }),

    getByProjectId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        const posts = await ctx.db.post.findMany({
            where: {
            projectId: input,
            },
        });

        return posts;
    }),

    getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        const posts = await ctx.db.post.findFirst({
            where: {
            id: input,
            },
        });

        return posts;
    }),

    createPost: authedProcedure
        .input(
        z.object({
            projectId: z.string(),
            title: z.string(),
            content: z.string(),
        }),
        )
        .mutation(async ({ ctx, input }) => {
        await ctx.db.post.create({ data: input });
    }),
})
