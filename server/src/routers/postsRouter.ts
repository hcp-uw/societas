import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { projectsRouter } from "./projectsRouter";

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
            orderBy: {
                updatedAt: 'desc'
            }
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

    editPost: authedProcedure
        .input(
            z.object({
                postId: z.string(),
                title: z.string(),
                content: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
        await ctx.db.post.update({
            where: {
                id: input.postId
            },
            data: {
                title: input.title,
                content: input.content
            }
        })
    }),
})
