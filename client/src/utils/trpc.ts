import {
  createTRPCReact,
  inferReactQueryProcedureOptions,
} from "@trpc/react-query"
import type { AppRouter } from "../../../server/src/index"
import { inferRouterInputs } from "@trpc/server"

export type RouterOutputs = inferRouterInputs<AppRouter>
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>
export const trpc = createTRPCReact<AppRouter>()
