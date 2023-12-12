import { z } from "zod"
import { authedProcedure, publicProcedure, router } from "../trpc"

export const projectsRouter = router({
  getAll: authedProcedure.query(async ({ ctx }) => {
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
    .mutation(async ({ ctx, input }) => {}),
})
