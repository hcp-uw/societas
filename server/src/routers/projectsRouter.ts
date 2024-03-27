import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const projectsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      take: 5,
    });
    return projects;
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await ctx.db.project.findFirst({
      where: {
        id: input,
      },
    });

    // const membershipts  = await ctx.db

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No project has corresponding id",
      });
    }

    return data;
  }),

  getByUserId: authedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.project.findMany({
        where: {
          ownerId: input,
        },
      });
    }),

  // must be owner
  kickUser: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.memberships.delete({
        where: {
          projectId_userId: input,
        },
      });
    }),

  getPosts: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.post.findMany({
      where: {
        projectId: input,
      },
    });
  }),

  // must be owner
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

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        meetType: z.string(),
        ownerId: z.string(),
        meetLocation: z.string(),
<<<<<<< HEAD
        imageUrl: z.string()
      })
=======
      }),
>>>>>>> 227491f45aa0e01d72d3e1363660b3bfc7675fba
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.project.create({ data: input });
      } catch (e) {
        console.log("here");
      }
    }),
});
