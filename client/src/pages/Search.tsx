import { useRef, useState } from 'react';
import { trpc } from '../utils/trpc';
import ProjectsView from '../components/ProjectsView';

export default function Search() {
    const [searchTags, setSearchTags] = useState(['']);
    const { data } = trpc.projects.getByTags.useQuery(searchTags);
    const utils = trpc.useUtils();
    const searchTagInputRef = useRef<HTMLInputElement>(null);

    const breakpointColumnsObj = {
        default: 4,
        1826: 3,
        1347: 2,
        900: 1,
    };

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        const prev = searchTags;
        if (searchTagInputRef.current !== null) {
            const value = searchTagInputRef.current.value;
            if (value === '') return;
            setSearchTags((prev) => {
                if (prev.length === 1 && prev[0] === '') return [value];
                else return [...prev, value];
            });
            searchTagInputRef.current.value = '';
        }
        utils.projects.getByTags.invalidate(prev);

        return;
    };

    const handleSearchReq = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
    };

    return (
        <>
            <div
                style={{
                    textAlign: 'center',
                    fontSize: 20,
                }}
            >
                <br />
                <form onSubmit={addItem}>
                    Add Tags to Search:
                    <input
                        type="text"
                        ref={searchTagInputRef}
                        style={{
                            border: '10px',
                            backgroundColor: 'pink',
                            //borderColor: "red"
                        }}
                    />
                    <button>Add</button>
                </form>

                <br />
                <br />
                <form onSubmit={handleSearchReq}>
                    <button>Search</button>
                </form>
                <br />
                <br />

                <h3>Search Tags:</h3>
                {searchTags.map((tag) => {
                    return <div>{tag}</div>;
                })}
            </div>
            <ProjectsView
                projects={data === undefined ? [] : data}
                breakPoints={breakpointColumnsObj}
            />
        </>
    );
}
