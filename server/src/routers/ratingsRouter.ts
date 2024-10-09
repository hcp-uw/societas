import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const ratingRouter = router({
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
  create: authedProcedure
    .input(
      z.object({
        feedback: z.string(),
        rating: z.number(),
        projectId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.ratings.create({ data: input });
    }),

    
});
