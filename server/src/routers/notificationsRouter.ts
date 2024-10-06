import { z } from 'zod';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { NotificationType } from '@prisma/client';

const isValidNotifType = (s : String) : boolean =>{
  return s == "PROJECT" || s == "REQUEST" || s == "POST";
}

export const sendNotificationHandler = async (ctx:any, input:any) => {
  if (isValidNotifType(input.type)) {
    await ctx.db.notification.create({
      data: {
        userId: input.userId,
        content: input.content,
        type: input.type as NotificationType,
        title: input.title,
        typeId: input.typeId
      }
    });
  } else {
    console.log("Error: not a valid notification type");
  }
};



export const notificationsRouter = router({

  sendNotification : authedProcedure
    .input(z.object({
      userId: z.string(),
      content: z.string(),
      type: z.string(),
      title: z.string(),
      typeId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if(isValidNotifType(input.type)){
        await ctx.db.notification.create({data: {
          userId: input.userId,
          content: input.content,
          type: input.type as NotificationType,
          title: input.title,
          typeId: input.typeId
        }})
      }else{
        console.log("Error: not a valid notification type")
      }
    }),


  getAllByUserId : authedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try{
        return await ctx.db.notification.findMany({
          where: {
            userId: input
          },
        })
      }catch(e){
        console.log("Error with getting notifications")
      }
    }),

  deleteNotification : authedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try{
        ctx.db.notification.delete({
          where: {
            id: input
          }
        })
      }catch(e){
        console.log("Error Deleting notification")
      }
    }),
  
  

})