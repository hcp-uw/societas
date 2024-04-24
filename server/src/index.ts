import { createTRPCContext, router } from "./trpc";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { projectsRouter } from "./routers/projectsRouter";
import { membershipsRouter } from "./routers/membershipsRouter";
import { ratingRouter } from "./routers/ratingsRouter";

const appRouter = router({
  projects: projectsRouter,
  memberships: membershipsRouter,
  ratings: ratingRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error }) => {
    console.log(error);
  },
  middleware: cors({
    origin: "*",
  }),
});
server.listen(3001);
console.log("Server running running on http://localhost:3001");
