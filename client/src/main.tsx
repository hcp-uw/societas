import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient } from '@tanstack/react-query';
import Home from './pages/Home.tsx';
import Project, {
  ProjectInfo,
  ProjectPostsLayout,
  CreatePost,
  ProjectPost,
  MemberList,
  PostInfo,
} from './pages/Project.jsx';
import ProfileLayout from './pages/ProfileLayout.tsx';
import CreateProj from './pages/CreateProj.tsx';
import Requests from './pages/Requests.tsx';
import Intro from './pages/Intro.jsx';
import PreferencePage from './pages/PreferencePage.tsx';
import WhoopsPage from './pages/WhoopsPage.tsx';
import ReportPage from './pages/ReportPage.tsx';
import Profile, { EditProfile } from './pages/Profile.tsx';
import Search from './pages/Search.tsx';
import { EditProject } from './pages/EditProject.tsx';
import { EditPost } from './pages/EditPost.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
});
if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw 'Missing Publishable Key';
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

if (
  localStorage.getItem('firstTimeUser') == null &&
  localStorage.getItem('firstTimeUser') !== 'false'
) {
  localStorage.setItem('firstTimeUser', 'true');
}

const router = createBrowserRouter([
  {
    path: '/intro',
    element: <Intro />,
  },
  {
    path: '/',
    element: <App queryClient={queryClient} />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'create',
        element: <CreateProj />,
      },
      {
        path: 'requests',
        element: <Requests />,
      },
      {
        path: ':projectId',
        element: <Project />,
        children: [
          {
            index: true,
            element: <ProjectInfo />,
          },
          {
            path: 'leaveProject',
            element: <ProjectInfo />,
          },
          {
            path: 'posts',
            element: <ProjectPostsLayout />,
            children: [
              {
                path: ':postId',
                element: <ProjectPost />,
                children: [
                  {
                    index: true, 
                    element: <PostInfo/>
                  },
                  {
                    path: 'editpost',
                    element: <EditPost/>
                  }
                ]
              },
            ],
          },
          {
            path: 'posts/new',
            element: <CreatePost />,
          },
          {
            path: 'members',
            element: <MemberList/>
          },
          {
            path: 'edit',
            element: <EditProject/>
          }
        ],
      },
      {
        path: 'account',
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: 'edit',
            element: <EditProfile />,
          },
          {
            path: 'requests/acceptReq',
            element: <Requests />,
          },
          {
            path: 'requests/rejectReq',
            element: <Requests />,
          },
        ],
      },
      {
        path: 'preference',
        element: <PreferencePage />,
      },
      {
        path: 'whoops',
        element: <WhoopsPage />,
      },
      {
        path: 'report',
        element: <ReportPage />,
      },
      {
        path: 'search',
        element: <Search />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);
