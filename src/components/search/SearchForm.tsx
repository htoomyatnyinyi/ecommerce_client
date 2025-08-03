import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuery, clearQuery } from "@/redux/slice/searchSlice";
import type { RootState } from "@/redux/store/store";
import { useSearchProductsQuery } from "@/redux/query/productApi";

const SearchForm: React.FC = () => {
  const dispatch = useDispatch();
  // Select the query from the Redux store
  const query = useSelector((state: RootState) => state.search.query);

  const { data: searchProducts, isLoading: isSearching } =
    useSearchProductsQuery(query, { skip: !query });

  if (isSearching) return <p>Searching ...</p>;

  // console.log(searchProducts, "searcing");

  // Handle input change
  const handleChange = (e: any) => {
    dispatch(setQuery(e.target.value));
  };

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Search query:", query, e);
    // Add logic to handle search (e.g., API call)
  };

  // Handle clearing the search
  const handleClear = () => {
    dispatch(clearQuery());
  };

  return (
    <form onSubmit={handleSubmit} className=" p-2 m-1">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="search-box"
      />
      <button type="submit" className="p-2 m-1 border">
        Search
      </button>
      <button type="button" onClick={handleClear} className="p-2 m-1 border">
        Clear
      </button>
    </form>
  );
};

export default SearchForm;
