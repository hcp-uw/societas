import { z } from "zod"
import { authedProcedure, publicProcedure, router } from "../trpc"
import { Memberships } from "@prisma/client"

export const membershipsRouter = router({
  getAllUserMemberships: authedProcedure
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
  getRole: authedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.memberships.findFirst({
        where: {
          projectId: input.projectId,
          userId: ctx.auth.userId,
        },
      })
      ctx.auth.userId
    }),
})
