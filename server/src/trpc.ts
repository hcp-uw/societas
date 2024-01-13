import { TRPCError, initTRPC } from "@trpc/server"
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone"
import { prisma } from "./db"
import { clerkClient } from "@clerk/clerk-sdk-node"

//inner context
function createContextInner(opts: CreateHTTPContextOptions) {
  return {
    db: prisma,
    auth: {
      // session: opts.req.headers.authorization,
      authorization: opts.req.headers.authorization as string,
    },
  }
}
// context
export function createTRPCContext(opts: CreateHTTPContextOptions) {
  const contextInner = createContextInner(opts)
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  }
}
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create()

const enforeceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  try {
    await clerkClient.verifyToken(ctx.auth.authorization)
  } catch (err) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user is not logged in",
    })
  }

  return next({
    ctx: {
      auth: {
        authorization: ctx.auth.authorization,
      },
    },
  })
})

/*
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure
export const authedProcedure = publicProcedure.use(enforeceUserIsAuthed)
