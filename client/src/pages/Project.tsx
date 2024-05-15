import {
  FetcherWithComponents,
  useNavigate,
  useParams,
} from 'react-router-dom';
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
import Husky from "../assets/HuskyRating.png";
import Husky2 from "../assets/HuskyGreeting.png";

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

  const ratingMutation = trpc.ratings.create.useMutation({
    onSuccess() {
      utils.ratings.getAll.invalidate();
      // toast.success("Project Created!");
      // navigate("/");
    },
  });

  // const { projectId } = useParams()
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

  const requestData = trpc.memberships.getAllPendingRequests.useQuery(
    projectId ?? '',
  );

  if (requestData.data != undefined) {
    console.log(requestData.data);
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

    /////////////////////////
  // rate projects
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);

  const handleOpenFirstModal = () => {
    setFirstModalOpen(true);
  };

  const handleCloseFirstModal = () => {
    setFirstModalOpen(false);
  };

  const handleOpenSecondModal = () => {
    setFirstModalOpen(false);
    setSecondModalOpen(true);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const feedbacks = formData.get("feedbacks") as string;
    const rating = Object.fromEntries(formData).stars;
    if (!user) {
      return;
    }
    
    ratingMutation.mutate({
      userId: user.id,
      projectId: projectId ?? "",
      feedback: feedbacks,
      rating: parseInt(rating as string),
    })

    // console.log("Feedbacks:", feedbacks);
    // console.log(typeof(parseInt(rating as string)));
    // console.log(user?.firstName, user?.lastName);
    // console.log(user);
    // console.log(projectId);

    handleCloseFirstModal();
    handleOpenSecondModal();
  };

  

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
        <Spinner size={24} />
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

        <div className="w-full max-w-6xl m-auto flex flex-col gap-4">
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
            </div>

            <div className="flex gap-4 flex-row-reverse">
              <StatusChip
                projectId={projectId ?? ''}
                startDate={new Date(data.startDate ?? '')}
                role={role}
                setShowModal={setShowModal}
                isLoading={roleIsLoading}
                ownerId={data.ownerId}
                handleLeaveReq={handleLeaveReq}
                firstModalOpen={firstModalOpen}
                secondModalOpen={secondModalOpen}
                handleSubmit={handleSubmit}
                handleOpenFirstModal={handleOpenFirstModal}
                handleCloseFirstModal={handleCloseFirstModal}
              />
            </div>
          </nav>
          <Outlet />
        </div>
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
  firstModalOpen: boolean;
  secondModalOpen: boolean;
  startDate: Date;
  handleOpenFirstModal: () => void;
  handleCloseFirstModal: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleLeaveReq: (e: React.FormEvent<HTMLFormElement>) => void;
};

function StatusChip({
  role,
  isLoading,
  ownerId,
  setShowModal,
  handleLeaveReq,
  firstModalOpen,
  secondModalOpen,
  handleSubmit,
  handleOpenFirstModal,
  handleCloseFirstModal,
  startDate,
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
    if (startDate > new Date()) {
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
      )
    } else {
    return (
      <>
       <div>
          <button className="text-zinc-100 h-fit py-1 px-6 rounded-lg bg-blue-500 font-medium hover:bg-blue-300 transition-colors" onClick={handleOpenFirstModal}>
              Rate Project
          </button>

          {firstModalOpen ? (
            <form
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="bg-white p-8 rounded shadow-lg w-1/2">
                <h1 className="text-center RTPO-title" style={{ fontSize: "37px" }}>
                  Rate Your Experience:
                  {/* Project Owner: Flying Walrus{" "} */}
                </h1>
                <h1
                  className="text-center RTPO-subTitle"
                  style={{ fontSize: "20px" }}
                >
                  5000 Pieces Puzzle BuildingFlying Walrus
                </h1>

                <div className="RTPO-wrapper">
                  <div className="col-7">
                    {/* stars */}
                    <div className="starContainer">
                      <div className="container__items">
                        <input type="radio" name="stars" id="st5" value={5} />
                        <label htmlFor="st5">
                          <div className="star-stroke shadow ">
                            <div className="star-fill"></div>
                          </div>
                          <div
                            className="label-description"
                            data-content="Excellent"
                          ></div>
                        </label>


                        <input type="radio" name="stars" id="st4" value={4} />
                        <label htmlFor="st4">
                          <div className="star-stroke shadow ">
                            <div className="star-fill"></div>
                          </div>
                          <div
                            className="label-description"
                            data-content="Good"
                          ></div>
                        </label>


                        <input type="radio" name="stars" id="st3" value={3} />
                        <label htmlFor="st3">
                          <div className="star-stroke shadow ">
                            <div className="star-fill"></div>
                          </div>
                          <div
                            className="label-description"
                            data-content="OK"
                          ></div>
                        </label>


                        <input type="radio" name="stars" id="st2" value={2} />
                        <label htmlFor="st2">
                          <div className="star-stroke shadow ">
                            <div className="star-fill"></div>
                          </div>
                          <div
                            className="label-description"
                            data-content="Bad"
                          ></div>
                        </label>


                        <input type="radio" name="stars" id="st1" value={1} />
                        <label htmlFor="st1">
                          <div className="star-stroke shadow ">
                            <div className="star-fill"></div>
                          </div>
                          <div
                            className="label-description"
                            data-content="Terrible"
                          ></div>
                        </label>
                      </div>
                    </div>

                    <div className="RTPO-input-div">
                      <input
                        type="text"
                        name="feedbacks"
                        className="RTPO-form-control"
                        aria-describedby="tagsHelpInline"
                        placeholder="Have feedbacks? Share it here!"
                      />
                      <div className="RTPO-input-notes">
                        <p>
                          Note: Your feedback will be anonymouse and only visible to
                          the project owner!{" "}
                        </p>
                      </div>
                    </div>

                    <div
                      className="RTPO-button-wrapper"
                      style={{ padding: "6% 15% 10% 15%" }}
                    >
                      <button
                        type="submit"
                        className="PP-button RTPO-button-orange"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        id="closeModal"
                        className="PP-button RTPO-button-red"
                        onClick={handleCloseFirstModal}
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                  <div className="Hysky-Img-Wrapper">
                    <div className="speech-bubble RTPO-speech-bubble-text">
                      <span>
                        How many stars would you like to give to
                        <span className="RTPO-name"> {""}Flying Walrus?</span>
                      </span>
                    </div>
                    <img
                      src={Husky}
                      alt="Husky Greeting!"
                      className="huskyRatingImg"
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div></div>
          )}

          {secondModalOpen ? (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="bg-white p-8 rounded shadow-lg w-1/2">
                <img src={Husky2} alt="Husky Woof!" className="image-center" />
                <h1 className="text-center RC-title" style={{ fontSize: "45px" }}>
                  Woof!
                </h1>


                <div
                  className="text-center RC-text"
                  style={{ marginTop: "2rem", fontSize: "22px" }}
                >
                  <p style={{ marginBottom: "0" }}>
                    You have successfully submitted the rating for
                    <span style={{ fontWeight: "bolder", fontSize: "23px" }}>
                      {" "}
                      Flying Walrus
                    </span>
                    !! Thank you!!
                  </p>
                </div>


                <div className="RC-button-wrapper">
                  <NavLink to="/account" className="RC-button-confirmation">
                    <button type="button" className="PP-button RC-button-orange">
                      Close
                    </button>
                  </NavLink>


                  <NavLink to="/" className="RC-button-confirmation">
                    <button type="button" className="PP-button RC-button-orange">
                      Back To Home Page
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
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
      console.log('here');

      if (data.length === 0) return;
      navigate(`/${projectId}/posts/${data[0].id}`);
    }
  }, []);

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
