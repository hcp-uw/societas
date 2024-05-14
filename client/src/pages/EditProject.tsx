import { useUser } from "@clerk/clerk-react";
import { RouterOutputs, trpc } from "../utils/trpc"
import { useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { FilesView, InputsView } from "./CreateProj";
import toast from "react-hot-toast";


type FormState = {
  title: string;
  description: string;
  location: string;
  maxMems: string;
  startDate: string;
  image: Blob | null | string;
};

type ProjectData = RouterOutputs["projects"]["getById"]
type EditProjectProps = {
  oldData: ProjectData
}
export function EditProject(){
  const {user} = useUser();
  const params = useParams();
  const utils = trpc.useUtils();
  const navigate = useNavigate();

  const { data: oldData} = trpc.projects.getById.useQuery(params.projectId ?? "")
  
  if(!oldData) return <div>Error</div>

  // const getImageAsBlob = async (url : string) : Promise<Blob | null>  => {
  //   // try{
  //   //   const response = await fetch(url);
  //   //   const blob = await response.blob();
  //   //   return blob;
  //   // } catch (error) {
  //   //   console.error('Error fetching image:', error);
  //   //   return null;
  //   // }
  //   return null
  // }

  const [formState, setFormState] = useState<FormState>({
    title: oldData.name,
    description: oldData.description,
    location: oldData.meetLocation,
    maxMems: "0",
    image: oldData.imageUrl,
    startDate: oldData.startDate,
  });

  function isFormValid() {
    Object.values(formState).forEach((val) => {
      if (val === '' || val === null) return false;
    });
    return true;
  }

  const [addedTags, setAddedTags] = useState<string[]>(oldData.tags);

  const tagMutation = trpc.tags.addTags.useMutation({
    onSuccess() {
      // TO DO:
    },
  });
  const projMutation = trpc.projects.edit.useMutation({
    onSuccess() {
      utils.projects.getById.invalidate();
      toast.success('Project Edited!');
      tagMutation.mutate(addedTags);
      navigate(`/${params.projectId}`);
    },
  });

  // getImageAsBlob(oldData.imageUrl).then((img) => {
  //   setFormState((prev) => ({...prev, image: null}))
  // })
  
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    if (!formState.image) return;
    if(!params.projectId) return;
    // uploadImageMutation.mutate(formState.image);
    projMutation.mutate({
      projectId: params.projectId,
      name: formState.title,
      description: formState.description,
      meetLocation: formState.location,
      meetType: oldData?.meetType ?? "",
      imageUrl: formState.image.,
      tags: addedTags,
    });
  }

  return (
    <Form
      method="post"
      className="flex max-w-6xl gap-2 mx-auto mt-4 justify-between w-full"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div>
        <FilesView formState={formState} setFormState={setFormState} />
      </div>
      <InputsView
        formState={formState}
        setFormState={setFormState}
        isFormValid={isFormValid}
        loading={projMutation.isLoading}
        addedTags={addedTags}
        setAddedTags={setAddedTags}
      />
      <input type="hidden" name="ownerId" value={user?.id} />
      {/* Submit button for mobile view */}
      <button onClick={() => console.log(formState)}> Check Form State</button>
    </Form>
  );

}