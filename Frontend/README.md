# Frontend for societas

We are using [**Vite**](https://vitejs.dev/) to create the project. We also use [**React Query**](https://tanstack.com/query/latest/docs/react/overview) to handle our queries, enabling caching, as well as error and loading states. For our routing, we use [**React Router**](https://reactrouter.com/en/main) v6, where we take advantage of loader functions to get data as soon as possible, we also take advantage of their actions to handle any form submission in a super minimalistic and granular fashion, something that is surprisingly difficult to do with React.js.

For our authentication we use [**Clerk**](https://clerk.com), this library make authentication really easy and is packed with nice features, such as email verification and user metadata. We decided to go with "easy route" with authentication because we believe auth kills projects, since most people decide to implemnt it first. Thankfully Clerk has our back!

The frontend team first started stlying with [**styled-components**](https://styled-components.com/), however we moved on to [**tailwind**](https://tailwindcss.com/) because of their utility first approach. The most annoying part about writing CSS is definitely naming classes, and tailwinds gets rid of that, and adds a bunch of cool features. We also use a index.css file, since we have team members that learning web development.

Our demo is using [**Firebase**](https://firebase.google.com/) client calls do handle all of the data reading and writing to the database, as well as image uploading. However, we plan to remove this client side calls to calling an API instead. Firebase is super handy because its a serverless service that is very plug and play.

Lastly, for our markdown renderer, we use [**react-markdown**](https://github.com/remarkjs/react-markdown), and to actually style it we use tailwind's plugin for typography to style all of the elements. We decided to use react-markdown because it actually renders elements within the react ecosystem and does not use `.dangerouslySetInnerHTML`, which vulnerable to code injection.

P.S we plan to migrate to TypeScript!!

## Fonts

Inter: href="https://fonts.googleapis.com/css?family=Inter"

Manrope: href="https://fonts.googleapis.com/css?family=Manrope"

DM Sans: href="https://fonts.googleapis.com/css?family=DM Sans"
