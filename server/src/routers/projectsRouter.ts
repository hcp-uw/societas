import { z } from "zod"
import { authedProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import { MembershipStatus } from "@prisma/client"

export const projectsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      take: 5,
    })
    return projects
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await ctx.db.project.findFirst({
      where: {
        id: input,
      },
    })

    // const membershipts  = await ctx.db

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No project has corresponding id",
      })
    }

    // let role = "none"
    // const memberShipStatus = data?.memberships.find(
    //   (mem) => mem.userId === userId
    // )
    // if (data?.ownerId == userId) {
    //   role = "owner"
    // } else if (memberShipStatus && memberShipStatus.status == "ACCEPTED") {
    //   role = "participant"
    // } else if (memberShipStatus && memberShipStatus.status == "PENDING") {
    //   role = "requestant"
    // }

    // if (data && data.memberships) {
    //   delete data.memberships;
    // }

    return data
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

  
  leaveProject: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const memberToDelete = {
        projectId: input, 
        userId: ctx.auth.userId
      }
      await ctx.db.memberships.delete({
        where: {
          projectId_userId: memberToDelete
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
