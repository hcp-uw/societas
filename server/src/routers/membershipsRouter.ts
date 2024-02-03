import { z } from "zod"
import { authedProcedure, publicProcedure, router } from "../trpc"
import { MembershipStatus, Memberships } from "@prisma/client"

export const membershipsRouter = router({

  createProjectJoinRequest: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        ownerId: z.string(),
        userId: z.string()       
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.auth.userId);
      await ctx.db.memberships.create({ data: input})
    }),



  getAllUserMemberships: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.memberships.findMany({
        where: {
          userId: input,
          status: "ACCEPTED",
        },
        select: {
          projectId: true,
        },
      })
    }),

  getAllPendingRequests: publicProcedure
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
  getRole: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.memberships.findFirst({
        where: {
          projectId: input,
          userId: ctx.auth.userId,
        },
      })
    }),


  getAllIncomingRequests: publicProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
      return await ctx.db.memberships.findMany({
        where:{
          ownerId: input,
          status: "PENDING"
        },
      })
    }),
  
  // must be owner
  acceptRequest: publicProcedure
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

})
