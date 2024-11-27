import styled from 'styled-components';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Form, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { StyledInput, Input, TextArea } from '../components/inputs';
import { trpc } from '../utils/trpc';
import Spinner from '../components/Spinner';
import { useMutation } from '@tanstack/react-query';
import { uploadProjectImage } from '../firebase';
import TagsAutocomplete from '../components/TagsAutocomplete';

export type FormState = {
  title: string;
  description: string;
  location: string;
  maxMems: string;
  startDate: string;
  meetType: string,
  tags: string[];
  image: Blob | null | string;
};

export type FormChangeHandler = <K extends keyof FormState>(key: K, value: FormState[K]) => void;

export default function CreateProj() {
  //elements to fill when creating a project.
  const [formState, setFormState] = useState<FormState>({
    title: '',
    description: '',
    location: '',
    maxMems: '',
    startDate: '',
    meetType: '',
    tags: [],
    image: null
  }); // state form the inputs

  const utils = trpc.useUtils();

  const navigate = useNavigate();

  const projMutation = trpc.projects.create.useMutation({
    onSuccess() {
      utils.projects.getAll.invalidate();
      toast.success('Project Created!');
      navigate('/');
      tagMutation.mutate(formState.tags);
    },
  });

  const tagMutation = trpc.tags.addTags.useMutation({
    onSuccess() {
      // TO DO:
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadProjectImage,
    onSuccess(url) {
      if (!user) return;
      projMutation.mutate({
        name: formState.title,
        description: formState.description,
        meetLocation: formState.location,
        meetType: formState.meetType,
        ownerId: user?.id,
        imageUrl: url,
        startDate: formState.startDate,
        tags: formState.tags,
        creatorName: (user?.firstName + ' ' + user?.lastName)
      });
    },
  });

  const { user } = useUser();

  if (!user) return <div>Must Be signed in to create project</div>;

  function isFormValid() {
    Object.values(formState).forEach((val) => {
      if (val === '' || val === null) return false;
    });
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    if (!formState.image || typeof formState.image === 'string') return;

    uploadImageMutation.mutate(formState.image);
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState(prev => ({ ...prev, [key]: value }));
  }

  //gets files view and inputs view from formstate.
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
      <input type="hidden" name="ownerId" value={user.id} />
      {/* Submit button for mobile view */}
    </Form>
  );
}

function AddTagsView({
  onChange,
  form
}: {
  onChange: FormChangeHandler;
  form: FormState;
}) {
  function handleAddTag(tag: string) {
    const val: string = tag.trim();
    if (form.tags.indexOf(val) !== -1) {
      return;
    }
    if (val === '') return;
    onChange('tags', [...form.tags, val]);
  }

  function handleTagDelete(tagToDelete: string) {
    onChange('tags', form.tags.filter((tag) => tag !== tagToDelete));
  }

  return (
    <>
      <ul className="flex">
        {form.tags.length > 0 ? (
          <>
            {form.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-zinc-200 w-fit flex py-1 px-3 items-center gap-2 justify-center"
              >
                <p>{tag}</p>
                <SmCloseBtn onClose={() => handleTagDelete(tag)} />
              </li>
            ))}
          </>
        ) : (
          <div className="text-zinc-400 text-md lowercase">
            No tags selected, search one!
          </div>
        )}
      </ul>
      <TagsAutocomplete onSelect={handleAddTag} />
    </>
  );
}

//shows the view for inputs to create a new project.
//updates fiewlds of formState when inputs are made.
export function InputsView({
  form,
  onChange,
  isFormValid,
  loading
}: {
  form: FormState;
  onChange: FormChangeHandler;
  isFormValid: () => boolean;
  loading: boolean;
}) {
  const onRadioChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.checked) {
      onChange(target.name as keyof FormState, target.value);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl p-6">
      <Input>
        <label htmlFor="title">Title</label>
        <StyledInput
          type="text"
          id="title"
          name="title"
          placeholder="Project Title"
          onChange={(e) => onChange('title', e.target.value)}
          value={form.title}
          required
          maxLength={75}
          disabled={loading}
        />
      </Input>

      <Input>
        <label htmlFor="description">Description</label>
        <TextArea
          name="description"
          id="description"
          cols={20}
          rows={5}
          placeholder="Description of your project"
          onChange={(e) => onChange('description', e.target.value)}
          value={form.description}
          required
          disabled={loading}
          maxLength={1500} //avg length of 300 words
        ></TextArea>
      </Input>

      <Input className="flex flex-col gap-2">
        <label>tags</label>
        <AddTagsView form={form} onChange={onChange} />
      </Input>

      <Input>
        <label htmlFor="meetLocation">Meet Location</label>
        <StyledInput
          type="text"
          id="meetLocation"
          name="meetLocation"
          placeholder="Enter Project Location Here"
          onChange={(e) => onChange('location', e.target.value)}
          value={form.location}
          required
          disabled={loading}
        />
      </Input>
      <div className="flex gap-4 min-w-fit">
        <label className="font-medium" htmlFor="in-person">
          Meeting type
        </label>
        <div className="gap-4 flex">
          <input
            type="radio"
            name="meetType"
            id="in-person"
            value="in-person"
            onChange={onRadioChange}
          />
          <label htmlFor="in-person">In Person</label>
        </div>
        <div className="gap-4 flex">
          <input type="radio" name="meetType" id="hybrid" value="hybrid" onChange={onRadioChange}/>
          <label htmlFor="hybrid">Hybrid</label>
        </div>
        <div className="gap-4 flex">
          <input type="radio" name="meetType" id="remote" value="remote" onChange={onRadioChange}/>
          <label htmlFor="remote">Remote</label>
        </div>
      </div>
      <Input>
        <label htmlFor="maxMems">maximum number of members:</label>
        <StyledInput
          type="number"
          id="maxMems"
          name="maxMembers"
          min={1}
          max={100}
          placeholder="5"
          onChange={(e) => onChange('maxMems', e.target.value)}
          value={form.maxMems}
          required
          disabled={loading}
        />
      </Input>
      <Input>
        <label htmlFor="startDate">Start Date</label>
        <StyledInput
          type="date"
          name="startDate"
          id="startDate"
          onChange={(e) => onChange('startDate', e.target.value)}
        />
      </Input>

      <SubmitBtnView isFormValid={isFormValid} desktop loading={loading} />
    </div>
  );
}

//shows view for selecting a picture for a project.
export function FilesView({
  form,
  onChange,
}: {
  form: FormState;
  onChange: FormChangeHandler;
}) {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="h-fit flex flex-col gap-1">
      <div>
        <h1 className="text-zinc-800 font-medium mb-4 flex items-center justify-between">
          Select a picture
        </h1>
        <label htmlFor="image" className="bg-zinc-300 p-3 rounded-lg overflow-hidden relative">
          Select file
          <input
            type="file"
            accept="image/*"
            className="absolute left-full -z-50 w-px"
            name="imageUrl"
            id="image"
            required={!form.image}

            //checks file size and for null returns.
            onChange={(e) => {
              setError(null);
              const maxFileSize = 1024 * 1024; // one mb
              if (!e.target.files) return;
              const file = e.target.files[0];

              if (file.size > maxFileSize) {
                setError('File size is too large');
                e.target.value = '';
                return;
              }
              onChange('image', file);
            }}
          />
        </label>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {form.image && (
        //loads the image and shows it on screen. Allows you to close it and not show it.
        <Image>
          <SmCloseBtn
            onClose={() => onChange('image', null)}
          />
          <img
            src={
              form.image instanceof Blob ? URL.createObjectURL(form.image) : form.image
            }
            className="w-full max-w-2xl"
          />
        </Image>
      )}
    </div>
  );
}

export function SmCloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      type="button"
      className="hover:bg-zinc-300 rounded-full flex items-center justify-center h-fit"
    >
      <span className="material-symbols-outlined">close</span>
    </button>
  );
}

//submit button view.
function SubmitBtnView({
  isFormValid,
  desktop,
  loading,
}: {
  isFormValid: () => boolean;
  desktop: boolean;
  loading: boolean;
}) {
  return (
    <SubmitWrapper $desktop={desktop}>
      <button
        //disabled while form is invalid. Changes to loading spinner when pressed.
        type="submit"
        disabled={!isFormValid()}
        aria-busy={loading}
        className="group relative flex items-center justify-center bg-blue-500 text-zinc-100 cursor-pointer py-2 px-4 rounded-3xl transition-all hover:bg-blue-600 hover:shadow-md disabled:bg-blue-300 disabled:pointer-events-none min-w-[8rem] aria-busy:bg-blue-300 aria-busy:pointer-events-none"
      >
        <p className="text-lg font-medium group-aria-busy:opacity-0">
          Create Project
        </p>

        <div
          className={`absolute pointer-events-none ${loading ? 'opacity-100' : 'opacity-0'}`}
        >
          <Spinner size={16} />
        </div>
      </button>
    </SubmitWrapper>
  );
}

const SubmitWrapper = styled.div<{ $desktop?: boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  display: ${props => props.$desktop ? 'none' : 'default'};
  @media (min-width: 62rem) {
    display: inline-block;
    display: ${props => props.$desktop ? 'flex' : 'none'};
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

const Image = styled.div`
  position: relative;
  width: fit-content;
  /* height: fit-content; */
  img {
    object-fit: cover;
  }
  button {
    position: absolute;
    right: 0;
    margin-right: 0.2rem;
    margin-top: 0.2rem;
    border-radius: 50%;
    border: none;
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition:
      opacity 150ms ease-in,
      background-color 150ms ease-in;

    span {
      font-size: 1.3rem;
      color: black;
    }
  }
  &:hover {
    button {
      opacity: 1;
      cursor: pointer;
    }
  }
  margin-bottom: 0.5rem;
`;
