import { ChangeEvent, useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import ProjectsView from "../components/ProjectsView";
import { util } from "zod";


type FilterState = {
  input: string,
  tags: string[],
  isAutcompleted: boolean
}

export default function Search(){
  const utils = trpc.useUtils();

  const [filterState, setFilterState] = useState<FilterState>({
    input: "",
    tags: [],
    isAutcompleted: false
  });

  const {data: projData} = trpc.projects.getByTags.useQuery(filterState.tags);
  const {data: autcompleteOptions} = trpc.tags.getAutocompleteOptions.useQuery(filterState.input);

  const [errorState, setErrorState] = useState<boolean>(false);
  

  const breakpointColumnsObj = {
    default: 4,
    1826: 3,
    1347: 2,
    900: 1,
  }

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    const val = filterState.input.trim();
    if(val === "" || filterState.tags.indexOf(val) !== -1)
      return;
    setFilterState(prev => ({...prev, input: "", tags: [...prev.tags, val], }));
    utils.projects.getByTags.invalidate();
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFilterState(prev => ({...prev, input: e.target.value}));
    utils.tags.getAutocompleteOptions.invalidate();
  }

  const handleTagDelete = (tag: string) => {
    const newTags : string[] = filterState.tags.concat([]);  // create a deep copy
    const index = newTags.indexOf(tag);
    if(index == -1){
      console.error("Tag not found in added tags");
      return;
    }
    newTags.splice(index, 1);
    setFilterState(prev => ({...prev, tags: newTags}));
  }

  const handleSelectAutocomplete = (tag: string) => {
    setFilterState(prev => ({...prev, input: tag, isAutcompleted: true}));
  }

  useEffect(() => {
    if(filterState.isAutcompleted){
      addItem();
      setFilterState(prev => ({...prev, isAutcompleted: false}))
    }
  }, [filterState.isAutcompleted])


  return (
    <>
      <div 
        style = {{
          textAlign: "center",
          fontSize: 20
        }}>
        
        
        <br /> 
        <form className = "text-2xl" onSubmit={addItem}>
          Add Tags to Search: 
          <input 
            type="text" 
            value = {filterState.input}
            onChange={handleInputChange}
            style={{
              border: "10px",
              backgroundColor: "pink",
              //borderColor: "red"
            }}
          />
          <button>Add</button>
        </form>
        <br /> 
        <br /> 
        <br /> 
        <h3 className = "text-2xl">Autcomplete Results:</h3>
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
        <br /> 
        <br /> 
        <br /> 
        <h3 className = "text-2xl">Search Tags:</h3>
        {filterState.tags.map(tag => {
          return <div>
            {tag}
            <input 
              type = "button"
              value = "Delete"
              onClick={() => handleTagDelete(tag)}
              className="mx-8 my-2 border-2 border-red-500 border-solid border-spacing-3 w-24"
            />
          </div>;
        })}
       
        <br /> 
        <br /> 
        <br /> 
        <br /> 
      </div>
      <ProjectsView projects={projData===undefined ? [] : projData} breakPoints={breakpointColumnsObj}/>
    </>
  );
}
