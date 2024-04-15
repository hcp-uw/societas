import { useState } from 'react';
import { trpc } from './trpc';
import { StyledInput } from '../components/inputs';

type AutcompleteParams = {
  onSelect: (str: string) => void;
};

export default function GetAutcomplete(params: AutcompleteParams) {
  const [input, setInput] = useState<string>('');
  const { data: autcompleteOptions } =
    trpc.tags.getAutocompleteOptions.useQuery(input);

  const handleSelectAutocomplete = (tag: string) => {
    params.onSelect(tag);
    setInput('');
  };

  return (
    <>
      <StyledInput
        type="text"
        className="border"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      {autcompleteOptions &&
        autcompleteOptions?.map((tag) => (
          <div className="flex bg-zinc-400 ">
            <p className="">{tag.name}</p>
            <button
              type="button"
              className=""
              onClick={() => handleSelectAutocomplete(tag.name)}
            >
              <span className="material-symbols-outlined">done</span>
            </button>
          </div>
        ))}

      {input.length > 0 && autcompleteOptions?.length === 0 && (
        <div>
          {input} <button type="button">create</button>
        </div>
      )}
    </>
  );
}
