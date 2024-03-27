import {
  createTRPCReact,
  inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import type { AppRouter } from "../../../server/src/index.ts";
import { inferRouterOutputs } from "@trpc/server";

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export const trpc = createTRPCReact<AppRouter>();
