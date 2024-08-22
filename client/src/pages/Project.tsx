import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import dayjjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from '@clerk/clerk-react';
import { TextArea, Input, StyledInput } from '../components/inputs';
import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { NavLink, Outlet, Form } from 'react-router-dom';
import Markdown from 'react-markdown';
import { RouterOutputs, trpc } from '../utils/trpc';
import { z } from 'zod';
import ActivityWrapper from '../components/ActivityWrapper';

dayjjs.extend(relativeTime);

function useGetProjectData() {
  const { projectId } = useParams();
  const query = trpc.projects.getById.useQuery(projectId ?? '');

  return {
    projectId,
    ...query,
  };
}

export default function Project() {
  const { data, isLoading, projectId } = useGetProjectData();
  const { data: role, isLoading: roleIsLoading } =
    trpc.memberships.getRole.useQuery(projectId ?? '');
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const utils = trpc.useUtils();

  const sendJoinReqMutation =
    trpc.memberships.sendProjectJoinRequest.useMutation({
      onSuccess() {
        console.log('Request Created');
        setShowModal(false);
        utils.memberships.getRole.invalidate(projectId);
        toast.success('Requested!');
      },
    });

  function handleJoinReqSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId) return;
    if (!data) return;
    if (!user) return;
    const formData = new FormData(e.currentTarget);

    const description = formData.get('description') as string;

    if (!role) {
      sendJoinReqMutation.mutate({
        projectId: projectId,
        ownerId: data.ownerId,
        userId: user?.id,
        description: description,
      });
    } else if (role.status === 'REJECTED') {
      sendJoinReqMutation.mutate({
        projectId: projectId,
        ownerId: data.ownerId,
        userId: user?.id,
        description: description,
        role: {
          status: role.status,
          id: role.id,
        },
      });
    }
  }

  const leaveProjectMutation = trpc.memberships.leaveProject.useMutation({
    onSuccess() {
      console.log('Left Project');
      utils.memberships.getRole.invalidate();
      toast.success('Left Project');
    },
  });

  function handleLeaveReq(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !projectId) return;
    if (confirm('Are you sure you want to leave this project?')) {
      leaveProjectMutation.mutate({
        projectId: projectId,
        userId: user?.id,
      });
    }
  }

  // TO DO: Delete Project

  // const deleteProjectMutation = trpc.projects.delete.useMutation({
  //   onSuccess(){
  //     utils.projects.getAll.invalidate();
  //     toast.success("projectDeleted");
  //     navigate("/");
  //   }
  // })

  // function handleDeleteProject(e: React.FormEvent<HTMLFormElement>){
  //   e.preventDefault();
  //   if(!user || !data || !projectId) return;

  //   if(user.id === data.ownerId){
  //     deleteProjectMutation.mutate({
  //       projectId: projectId,
  //       ownerId: user.id
  //     })
  //   }
  // }

  if (isLoading)
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
        }}
      >
        <Spinner size={64} />
      </div>
    );

  if (!data) return <div>Project was not found</div>;

  //shows the user the view of the project and ability/options to join.
  //TO FIX: join button is not working.
  return (
    <>
      <div className="flex justify-between mt-6">
        {showModal && (
          <div className="absolute w-screen h-screen bg-zinc-200 bg-opacity-75 top-0 left-0 flex items-center justify-center">
            <Form method="POST" onSubmit={handleJoinReqSubmit}>
              <label
                htmlFor="textAreaProj"
                className="text-2xl font-semibold mb-2 w-full flex justify-between"
              >
                Why do you want to join this project?
                <button
                  className="w-8 h-8 bg-zing-500 flex items-center justify-center rounded-full transition-colors hover:bg-zinc-700 hover:text-zinc-100"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </label>
              <p className="mb-2">
                Show the owner of this project why you might be a good fit!{' '}
                <br />
                This is entirely optional<span className="text-red-500">*</span>
              </p>
              <TextArea
                id="textAreaProj"
                className="w-full"
                cols={10}
                rows={10}
                name="description"
              />
              <input type="hidden" value={projectId} name="projectId" />
              <input
                type="hidden"
                value={user ? user.id : ''}
                name="requestantId"
              />
              <input type="hidden" value={data.ownerId} name="ownerId" />
              <input type="hidden" value={data.name} name="projectTitle" />
              {/* <input type="hidden" value={data.imageUrl} name="imageUrl" /> */}
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-600 transition-colors text-slate-100 px-4 rounded-lg mt-4 flex items-center justify-center min-w-[10rem] disabled:bg-blue-400`}
                disabled={sendJoinReqMutation.isLoading}
              >
                {sendJoinReqMutation.isLoading ? (
                  <Spinner />
                ) : (
                  <p className="py-2">Join</p>
                )}
              </button>
            </Form>
          </div>
        )}

        <ActivityWrapper className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-zinc-800 flex items-center">
            {data.name}
          </h2>
          <nav className="w-full flex gap-4 border-b-2 justify-between items-center">
            <div className="flex gap-4">
              <NavLink
                to={`/${projectId}`}
                end
                className={({ isActive }) =>
                  isActive
                    ? ' font-medium text-zinc-800 p-2 inline-block border-b-2 border-[#FBBC05] hover:bg-zinc-300 transition-colors'
                    : ' border-b-2 border-transparent p-2 text-zinc-600 inline-block hover:bg-zinc-300 transition-colors'
                }
              >
                Project Info
              </NavLink>
              <NavLink
                to={`/${projectId}/posts`}
                className={({ isActive }) =>
                  isActive
                    ? ' font-medium text-zinc-800 p-2 inline-block border-b-2 border-[#FBBC05] hover:bg-zinc-300 transition-colors'
                    : ' border-b-2 border-transparent p-2 text-zinc-600 inline-block hover:bg-zinc-300 transition-colors'
                }
              >
                Blog Posts
              </NavLink>
              <NavLink
                to={`/${projectId}/members`}
                className={({ isActive }) =>
                  isActive
                    ? ' font-medium text-zinc-800 p-2 inline-block border-b-2 border-[#FBBC05] hover:bg-zinc-300 transition-colors'
                    : ' border-b-2 border-transparent p-2 text-zinc-600 inline-block hover:bg-zinc-300 transition-colors'
                }
              >
                Members List
              </NavLink>
            </div>

            <div className="flex gap-4 flex-row-reverse">
              <StatusChip
                projectId={projectId ?? ''}
                role={role}
                setShowModal={setShowModal}
                isLoading={roleIsLoading}
                ownerId={data.ownerId}
                handleLeaveReq={handleLeaveReq}
              />
            </div>
          </nav>
          <Outlet />
        </ActivityWrapper>
      </div>
    </>
  );
}

function SubmitBtn({
  mutationLoading,
  label,
}: {
  mutationLoading: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      className={`bg-blue-500 hover:bg-blue-600 transition-colors text-slate-100 px-4 rounded-lg mt-4 flex items-center justify-center min-w-[10rem] disabled:bg-blue-400`}
      disabled={mutationLoading}
    >
      {mutationLoading ? <Spinner /> : <p className="py-2">{label}</p>}
    </button>
  );
}

type GetRole = RouterOutputs['memberships']['getRole'] | undefined;
type StatusChipProps = {
  role: GetRole;
  isLoading: boolean;
  ownerId: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  handleLeaveReq: (e: React.FormEvent<HTMLFormElement>) => void;
};

function StatusChip({
  role,
  isLoading,
  ownerId,
  setShowModal,
  handleLeaveReq,
  projectId,
}: StatusChipProps) {
  const user = useUser();

  if (isLoading) return <div>getting role</div>;

  if (!user.isSignedIn) {
    return <div>Log in to join!</div>;
  }

  if (user.user?.id === ownerId) {
    return (
      <div className="flex gap-4 items-center">
        <NavLink
          to="posts/new"
          className="inline-block bg-green-600 transition-colors hover:bg-green-700 py-1 px-6 rounded-lg text-zinc-100 font-medium"
        >
          New Post
        </NavLink>
        <NavLink
          to="edit"
          className="inline-block bg-green-600 transition-colors hover:bg-green-700 py-1 px-6 rounded-lg text-zinc-100 font-medium"
        >
          Edit Project InfoProje
        </NavLink>
      </div>
    );
  }

  if (user.isSignedIn && !role) {
    return (
      <button
        className="text-zinc-100 h-fit py-1 px-6 rounded-lg bg-[#FBBC05] font-medium hover:bg-yellow-500 transition-colors"
        onClick={() => setShowModal(true)}
      >
        Join
      </button>
    );
  }

  if (!role) return <div>error getting role</div>;

  if (role.status === 'REJECTED') {
    return (
      <button
        className="text-zinc-100 h-fit py-1 px-6 rounded-lg bg-[#FBBC05] font-medium hover:bg-yellow-500 transition-colors"
        onClick={() => setShowModal(true)}
      >
        Join
      </button>
    );
  } else if (role.status === 'PENDING') {
    return (
      <div className="py-1 px-6 bg-zinc-200 rounded-lg cursor-default">
        Requested
      </div>
    );
  } else if (role.status === 'ACCEPTED') {
    return (
      <>
        <Form method="post" onSubmit={handleLeaveReq}>
          <input type="hidden" value={user ? user.user.id : ''} name="userId" />
          <input type="hidden" value={projectId} name="projectId" />
          <button className="text-zinc-100 h-fit py-1 px-6 rounded-lg bg-blue-500 font-medium hover:bg-blue-300 transition-colors">
            Leave Project
          </button>
        </Form>
        <div className="py-1 px-6 bg-blue-500 text-zinc-100 rounded-lg cursor-default">
          Member
        </div>
      </>
    );
  }
}

export function CreatePost() {
  const { user } = useUser();
  const { data, isLoading, projectId } = useGetProjectData();
  const [isPreview, setIsPreview] = useState(false);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.posts.createPost.useMutation({
    onSuccess() {
      navigate('../posts');
      toast.success('post created!');
      utils.posts.getByProjectId.invalidate(projectId);
    },
  });

  if (isLoading) return <div>loading</div>;

  if (!user) return <div>loading</div>;

  if (!data) return <div>something went wrong! Try reloading</div>;

  if (data.ownerId !== user.id) {
    toast.error('Can only create post if owner');
    navigate('posts');
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const inputsSchema = z.object({
      title: z.string(),
      content: z.string(),
      projectId: z.string(),
    });
    const inputs = inputsSchema.parse(Object.fromEntries(formData));
    mutation.mutate({
      projectId: inputs.projectId,
      title: inputs.title,
      content: inputs.content,
    });
  }

  return (
    <div className="flex gap-4 items-start flex-col">
      <div>
        <button
          onClick={() => setIsPreview((prev) => !prev)}
          className="bg-zinc-100 hover:bg-zinc-200 transition-colors py-2 px-6 rounded-lg"
        >
          {isPreview ? 'Edit Text' : 'Preview'}
        </button>
      </div>
      <Form onSubmit={handleSubmit} className="flex gap-4 flex-col w-full">
        {isPreview ? (
          <>
            <h1 className="text-xl font-bold">
              {title.length > 0 ? (
                title
              ) : (
                <span className="italic text-zinc-400">No title</span>
              )}
            </h1>
            <article className="prose prose-base prose-slate border min-h-[16px] rounded-lg p-2">
              {comment.length > 0 ? (
                <Markdown>{comment}</Markdown>
              ) : (
                <p className="text-zinc-200">No content</p>
              )}
            </article>
          </>
        ) : (
          <>
            <Input>
              <StyledInput
                placeholder="Title"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Input>
            <div>
              <TextArea
                id="comment"
                cols={30}
                rows={10}
                className="w-full resize-none"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <a
                href="https://www.markdownguide.org/basic-syntax/"
                target="_blank"
                className="text-zinc-400 flex items-center transition-colors hover:text-blue-400"
                rel="noreferrer"
              >
                Styling with Markdown is supported
                <span className="material-symbols-outlined">markdown</span>
              </a>
            </div>
          </>
        )}
        <input type="hidden" name="content" value={comment} />
        <input type="hidden" name="projectId" value={projectId} />
        <SubmitBtn label="Submit" mutationLoading={mutation.isLoading} />
      </Form>
    </div>
  );
}

export function ProjectInfo() {
  const { data, isLoading } = useGetProjectData();

  if (isLoading) return <div>loading</div>;

  if (!data) return <div>something went wrong, Try again!</div>;

  return (
    <div className="flex justify-between w-full gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-zinc-800 leading-7">{data.description} </p>
        <p>
          <span className="underline font-semibold mr-3 underline-offset-4">
            Meet Location:
          </span>
          {data.meetLocation}
        </p>
        <p className="capitalize">
          <span className="underline font-semibold mr-3 underline-offset-4">
            Start Date:
          </span>
          {data.startDate}
        </p>
        <p className="capitalize">
          <span className="underline font-semibold mr-3 underline-offset-4">
            Posted:
          </span>
          {dayjjs(data.createdAt).fromNow()}
        </p>
        <p className="capitalize">
          <span className="underline font-semibold mr-3 underline-offset-4">
            Tags:
          </span>
          {data.tags.join(', ')}
        </p>
      </div>
      <img
        src={data.imageUrl}
        alt=""
        width={400}
        height={400}
        className="rounded-lg"
      />
    </div>
  );
}

export function ProjectPostsLayout() {
  const { projectId, postId } = useParams();
  const { data, isLoading, isError } = trpc.posts.getByProjectId.useQuery(
    projectId ?? '',
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (postId === undefined && data) {
      if (data.length === 0) return;
      navigate(`/${projectId}/posts/${data[0].id}`);
    }
  }, [data, navigate, postId, projectId]);

  if (isLoading) return <div>loading posts</div>;

  if (isError) return <div>something went wrong</div>;

  if (data.length === 0)
    return (
      <div className="font-medium text-zinc-800 text-lg">
        No Blog post to show
      </div>
    );

  return (
    <div className="flex justify-between gap-8 w-full overflow-hidden max-h-[800px]">
      <div className="flex w-full max-w-sm gap flex-col overflow-y-auto">
        {data.map((post) => (
          <NavLink
            key={post.id}
            className={({ isActive, isPending }) =>
              isActive
                ? 'flex w-full first:border-t first:rounded-t-lg last:rounded-b-lg border-2 gap-16 justify-between items-center p-4 border-blue-500 bg-zinc-300 max-w-xs transition-all'
                : isPending
                  ? 'flex w-full first:border-t first:rounded-t-lg last:rounded-b-lg border-x gap-16 justify-between items-center p-4 border-b border-zinc-500 animate-pulse max-w-xs transition-colors'
                  : 'flex w-full first:border-t first:rounded-t-lg last:rounded-b-lg border-x gap-16 justify-between items-center p-4 border-b border-zinc-400 max-w-xs hover:bg-zinc-200 transition-colors '
            }
            to={`${post.id}`}
          >
            <div>
              <p className="font-medium text-zinc-800">{post.title}</p>
              <p className="text-sm text-zinc-600">
                {dayjjs(post.createdAt).toDate().toLocaleDateString()}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

export function ProjectPost() {
  const params = useParams();
  const { data, isLoading } = trpc.posts.getById.useQuery(params.postId ?? '');
  if (isLoading) return <div>loading..</div>;

  if (!data) return <div>something went wrong</div>;

  return (
    <div className="flex-1 border-1 border-zinc-400 rounded-lg p-4 w-full overflow-auto">
      <article className="prose prose-base prose-slate">
        <Markdown>{data.content}</Markdown>
      </article>
    </div>
  );
}

export function MemberList() {
  const params = useParams();
  const { user } = useUser();
  const { data } = trpc.projects.getUserList.useQuery({
    userId: user?.id ?? '',
    projectId: params.projectId ?? '',
  });
  const utils = trpc.useUtils();
  const kickUserMutation = trpc.projects.kickUser.useMutation({
    onSuccess() {
      toast.success("Successfully kicked out user")
      utils.projects.getUserList.invalidate();
    },
  });

  if (!data) return <div>Error Fetching Members</div>;

  if (!data || data.length == 0) return <div> No Members</div>;

  const handleKickUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const userId = e.currentTarget.getAttribute('value');

    if (userId == null) return;

    kickUserMutation.mutate({
      userId: userId,
      projectId: params.projectId ?? '',
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 ml-8">
      {data.map((member) => (
        <div
          key={member.id}
          className="flex justify-between w-full border-2 py-5 px-4 rounded-xl"
        >
          {member.name}

          <div className="flex gap-4 items-center">
            <img
              src={member.imageUrl}
              alt={`${member.name} profile image`}
              width={60}
              height={60}
              className="rounded-full h-12 w-12 object-cover"
            />
            <button
              onClick={handleKickUser}
              value={member.id}
              className="bg-blue-600 p-2 h-fit text-zinc-100 rounded-xl"
            >
              Kick Member
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
