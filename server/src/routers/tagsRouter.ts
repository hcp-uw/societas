import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "../trpc";

export const tagsRouter = router({
  addTags: authedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      for(const tag of input){
        const isNew : boolean = null == await ctx.db.tag.findFirst({
          where: {
            name: {
              equals: tag,
              mode: "insensitive"
            }
          }
        })
        if(isNew)
          await ctx.db.tag.create({data: {name: tag.toLocaleLowerCase()}})
      }
    })
})