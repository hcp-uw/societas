import { useUser } from '@clerk/clerk-react';
import { trpc } from '../utils/trpc';
import { useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router-dom';
import { FilesView, FormState, InputsView } from './CreateProj';
import toast from 'react-hot-toast';

export function EditProject() {
  const { user } = useUser();
  const params = useParams();
  const utils = trpc.useUtils();
  const navigate = useNavigate();

  const { data: oldData } = trpc.projects.getById.useQuery(
    params.projectId ?? ''
  );

  const [formState, setFormState] = useState<FormState>(() =>
    oldData ? {
      title: oldData.name,
      description: oldData.description,
      location: oldData.meetLocation,
      maxMems: '0',
      meetType: oldData.meetType,
      image: oldData.imageUrl,
      startDate: oldData.startDate,
      tags: oldData.tags
    } : {
      title: '',
      description: '',
      location: '',
      maxMems: '',
      image: '',
      startDate: '',
      meetType: 'in-person',
      tags: []
    }
  );

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

  function isFormValid() {
    Object.values(formState).forEach((val) => {
      if (val === '' || val === null) return false;
    });
    return true;
  }

  const tagMutation = trpc.tags.addTags.useMutation({
    onSuccess() {
      // TO DO:
    },
  });
  const projMutation = trpc.projects.edit.useMutation({
    onSuccess() {
      utils.projects.getById.invalidate();
      toast.success('Project Edited!');
      tagMutation.mutate(formState.tags);
      navigate(`/${params.projectId}`);
    },
  });

  // getImageAsBlob(oldData.imageUrl).then((img) => {
  //   setFormState((prev) => ({...prev, image: null}))
  // })

  if (!oldData) return <div>Error</div>;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    if (!formState.image) return;
    if (!params.projectId) return;
    // uploadImageMutation.mutate(formState.image);
    projMutation.mutate({
      projectId: params.projectId,
      name: formState.title,
      description: formState.description,
      meetLocation: formState.location,
      meetType: oldData?.meetType ?? '',
      imageUrl: oldData?.imageUrl ?? '',
      tags: formState.tags,
    });
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState(prev => ({ ...prev, [key]: value }));
  }

  return (
    <Form
      method="post"
      className="flex max-w-6xl gap-2 mx-auto mt-4 justify-between w-full"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div>
        <FilesView form={formState} onChange={updateForm} />
      </div>
      <InputsView
        form={formState}
        onChange={updateForm}
        isFormValid={isFormValid}
        loading={projMutation.isLoading}
      />
      <input type="hidden" name="ownerId" value={user?.id} />
      {/* Submit button for mobile view */}
      <button onClick={() => console.log(formState)}> Check Form State</button>
    </Form>
  );
}
