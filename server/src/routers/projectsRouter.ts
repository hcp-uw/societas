import { z } from "zod"
import { authedProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"

export const projectsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      take: 5,
    })
    return projects
  }),

  getById: authedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.project.findFirst({
      where: {
        id: input,
      },
    })
  }),

  getByUserId: authedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.project.findFirst({
        where: {
          ownerId: input,
        },
      })
    }),

  createProjectJoinRequest: authedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = ctx.db.memberships.findFirst({
        where: input,
      })

      if (existing == null) {
        ctx.db.memberships.create({ data: input })
      } else {
        // throw error code
      }
    }),

  getAllPendingRequests: authedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.memberships.findMany({
        where: {
          userId: input,
          status: "PENDING",
        },
        select: {
          projectId: true,
        },
      })
    }),

  // must be owner
  acceptRequest: authedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.memberships.update({
        where: {
          id: input,
        },
        data: {
          status: "ACCEPTED",
        },
      })
    }),

  // must be owner
  rejectRequest: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.memberships.update({
        where: {
          projectId_userId: input,
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      })
    }),

  // must be owner
  kickUser: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.memberships.delete({
        where: {
          projectId_userId: input,
        },
      })
    }),

  getPosts: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.post.findMany({
      where: {
        projectId: input,
      },
    })
  }),

  // must be owner
  createPost: authedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.create({ data: input })
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        meetType: z.string(),
        ownerId: z.string(),
        meetLocation: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.project.create({ data: input })
      } catch (e) {
        console.log("here")
      }
    }),
})
