import Markdown from "react-markdown";
import { Form, useNavigate, useParams } from "react-router-dom";
import { Input, StyledInput, TextArea } from "../components/inputs";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import toast from "react-hot-toast";
import { SubmitBtn } from "./Project";


type PostState = {
  title: string, 
  content: string, 
}
export function EditPost(){
  console.log("in edit post")
  const {projectId, postId} = useParams();
  const {data: oldData, isLoading} = trpc.posts.getById.useQuery(postId ?? "");
  const [postState, setPostState] = useState<PostState>({
    title: oldData?.title ?? "", 
    content: oldData?.content ?? ""
  })
  const navigate = useNavigate();

  const utils = trpc.useUtils();
  const postMutation = trpc.posts.editPost.useMutation({
    onSuccess(){
      toast.success("Post Changed")
      utils.posts.getById.invalidate();
      utils.posts.getByProjectId.invalidate();
      navigate(-1)
    }
  })

  if(projectId === undefined || postId === undefined ){
    return <div>Error</div>
  }

  if(isLoading){
    return <div>Loading Old Data</div>;
  }

 

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postMutation.mutate({
      postId: postId,
      title: postState.title, 
      content: postState.content
    })
  }
  return (
    <Form onSubmit={handleSubmit} className="flex gap-4 flex-col w-full">
        {/* {isPreview ? (
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
        ) : ( */}
          <>
            <Input>
              <StyledInput
                placeholder="Title"
                name="title"
                id="title"
                value={postState.title}
                onChange={(e) => setPostState((prev) => ({...prev, title: e.target.value}))}
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
                value={postState.content}
                onChange={(e) => setPostState((prev) => ({...prev, content: e.target.value}))}
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
        {/* )} */}
        <SubmitBtn label="Submit" mutationLoading={postMutation.isLoading} />
      </Form>
  );
}