import { initTRPC } from "@trpc/server"
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone"
import { prisma } from "./db"
import { sessions, clerkClient } from "@clerk/clerk-sdk-node"
import type { TRPCClientIncomingMessage } from "@trpc/server/rpc"

type AuthenticateRequestOptions {
  apiUrl: string
  apiVersion: string
  req: TRPCClientIncomingMessage
}
//inner context
function createContextInner(opts: CreateHTTPContextOptions) {
  //   const sessionId = opts.req.headers.authorization
  //   console.log(sessionId)
  // const clientToken = "adsfadf"

  return {
    db: prisma,
    auth: {
      session: opts.req.headers.authorization,
      token: opts.req.headers.token,
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
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

const enforeceUserIsAuthed = t.middleware(async ({ ctx, next }) => {

  const { isSignedIn } = await clerkClient.authenticateRequest({ req: ctx.req });

  if (ctx.auth.session === undefined || ctx.auth.token === undefined) {
    throw new Error("Not authorized");
  }

  const session = await sessions.verifySession(
    ctx.auth.session,
    ctx.auth.token.toString()
  );
  if (session === null) {
    throw new Error("Not authorized");
  }

  return next({
    ctx: {
      auth: {
        session: ctx.auth.session,
        token: ctx.auth.token,
      },
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const authedProcedure = publicProcedure.use(enforeceUserIsAuthed)
