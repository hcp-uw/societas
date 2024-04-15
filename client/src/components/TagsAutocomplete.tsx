import { useRef, useState } from 'react';
import { trpc } from '../utils/trpc';
import { StyledInput } from '../components/inputs';

type AutcompleteParams = {
  onSelect: (str: string) => void;
};

export default function TagsAutocomplete(params: AutcompleteParams) {
  const [input, setInput] = useState<string>('');
  const [showOpts, setShowOpts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
   const { data: autocompleteOptions } = trpc.tags.getAutocompleteOptions.useQuery(input);

  const handleSelect = (tag: string) => {
    params.onSelect(tag);
    setInput('');
  };


  return (
    <div className="relative w-full">
      <StyledInput
        type="text"
        className="w-full"
        placeholder="Search for tag"
        ref={inputRef}
        onFocus={() => setShowOpts(true)}
        onBlur={() => setShowOpts(false)}
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />


      {showOpts && (
        <div className="flex flex-col border px-2 w-full absolute mt-2 bg-zinc-50 py-4 rounded-lg shadow-sm gap-2">
          {autocompleteOptions && autocompleteOptions?.length > 0 ?
            autocompleteOptions?.map((tag) => (
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onMouseUp={() => {
                  handleSelect(tag.name);
                  inputRef.current?.blur()
                  setInput('')
                }}
                className="flex hover:bg-zinc-200 rounded-md px-2 py-1 hover:cursor-pointer transition-colors"
              >
                <p className="">{tag.name}</p>
              </div>
            )) : <div>Sorry no Matches</div>}
        </div>
      )}
    </div>
  );
}
