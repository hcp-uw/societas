import { z } from "zod"
import { authedProcedure, publicProcedure, router } from "../trpc"

export const membershipsRouter = router({

  sendProjectJoinRequest: authedProcedure
    .input(
      z.object({
        projectId: z.string(),
        ownerId: z.string(),
        userId: z.string(),
        description: z.optional(z.string()),
        role: z.optional(z.object({
          status: z.string(),
          id: z.string()
        }))
      })
    )
    .mutation(async ({ ctx, input }) => {
      if(!input.role){
        await ctx.db.memberships.create({ 
          data: {
            projectId: input.projectId,
            ownerId: input.ownerId,
            userId: input.userId,
            description: input.description
          }
        })
      }else if(input.role.status === "REJECTED"){
        await ctx.db.memberships.update({
          where: {
            id: input.role.id
          },
          data:{
            status: "PENDING",
            description: input.description
          }
        })
      }
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
  rejectRequest: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.memberships.update({
        where: {
          id: input
        },
        data:{
          status: "REJECTED"
        }
      })
    }),

  leaveProject: authedProcedure
    .input(z.object({
      projectId: z.string(),
      userId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // const memberToDelete = {
      //   projectId: input, 
      //   userId: ctx.auth.userId
      // }
      await ctx.db.memberships.delete({
        where: {
          projectId_userId: input
        },
      })
    }),
})
