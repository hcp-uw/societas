import { z } from "zod"
import { authedProcedure, publicProcedure, router } from "../trpc"

export const projectsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      take: 5,
    })
    // console.log(ctx.userId)
    return projects
  }),

  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        meetType: z.string(),
        ownerId: z.string(),
        meetLocation: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          meetType: input.meetType,
          ownerId: input.ownerId,
          meetLocation: input.meetLocation,
          // imageUrl: input.imageUrl,
        },
      })
      return project
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id,
        },
      })
      return project
    }),
})
