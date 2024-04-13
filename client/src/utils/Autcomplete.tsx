import { useEffect, useState } from "react";
import { trpc } from "./trpc";

type AutcompleteParams = {
  input : string, 
  onSelect : Function
}

export default function GetAutcomplete(params: AutcompleteParams){
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const {data: autcompleteOptions} = trpc.tags.getAutocompleteOptions.useQuery(params.input);

  const handleSelectAutocomplete = (tag: string) => {
    params.onSelect(tag);
  }

  
  // useEffect(() => {
  //   if(isSelected){
  //     params.onSelect();
  //     setIsSelected(false);
  //   }
  // }, [isSelected])

  return <>
    {autcompleteOptions?.map(tag => {
      return <div>
        {tag.name}
        <input 
          type = "button"
          value = "Select"
          onClick={() => handleSelectAutocomplete(tag.name)}
          className="mx-8 my-2 border-2 border-red-500 border-solid border-spacing-3 w-24"
        />
      </div>;
    })}
  </>

}