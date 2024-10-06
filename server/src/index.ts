import { createTRPCContext, router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { projectsRouter } from './routers/projectsRouter';
import { membershipsRouter } from './routers/membershipsRouter';
import { tagsRouter } from './routers/tagsRouter';
import { postsRouter } from "./routers/postsRouter";
import { notificationsRouter } from './routers/notificationsRouter';

const appRouter = router({
  projects: projectsRouter,
  memberships: membershipsRouter,
  posts: postsRouter,
  tags: tagsRouter,
  notifications: notificationsRouter,
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
    origin: '*',
  }),
});
server.listen(3001);
console.log('Server running running on http://localhost:3001');
