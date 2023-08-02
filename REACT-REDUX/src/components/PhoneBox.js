import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPhonebooks, addContact, setCurrentPage, setSearchKeyword } from "../actions/phonebooks";
import PhoneHeader from "./PhoneHeader";
import PhoneList from "./PhoneList";

export default function PhoneBox() {
  const dispatch = useDispatch();
  const { data, sortOrder, currentPage, totalPages, searchKeyword, isLoading } = useSelector((state) => state.phonebook);

  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Fetch initial data when the component mounts
    dispatch(fetchPhonebooks(currentPage, sortOrder, searchKeyword))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, currentPage, sortOrder, searchKeyword]);

  const handleAddContact = async (name, phone) => {
    try {
      await dispatch(addContact(name, phone));
      // Don't need to reload the page after adding contact, the state will be updated automatically
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleSearch = (keyword) => {
    dispatch(setSearchKeyword(keyword)); // Use the setSearchKeyword action to update the searchKeyword
    dispatch(setCurrentPage(1)); // Reset the current page to 1 when performing a search
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
      if (currentPage < totalPages && !isLoadingRef.current) {
        isLoadingRef.current = true;
        // Increment the current page by 1 to fetch the next page data
        dispatch(setCurrentPage(currentPage + 1));
      }
    }
  }, [currentPage, totalPages, isLoadingRef, dispatch]);

  // Listen to scroll events and call handleScroll when appropriate
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Watch for changes in the 'isLoading' variable and reset isLoadingRef accordingly
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  return (
    <div className="container">
      <header>
        <PhoneHeader
          handleAddContact={handleAddContact}
          sortOrder={sortOrder}
          setSortOrder={(order) => dispatch({ type: 'SET_SORT_ORDER', payload: order })}
          handleSearch={handleSearch}
        />
      </header>
      <main className="mt-3">
        <ul>
          {data.map((contact) => (
            <PhoneList
              key={contact.id}
              id={contact.id}
              name={contact.name}
              phone={contact.phone}
              avatar={contact.avatar}
            />
          ))}
        </ul>
        <div style={{ height: "350px" }}></div>
      </main>
    </div>
  );
}