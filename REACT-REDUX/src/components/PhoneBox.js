import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPhonebooks, addContact, setCurrentPage, setSearchKeyword } from "../actions/phonebooks";
import PhoneHeader from "./PhoneHeader";
import PhoneList from "./PhoneList";

export default function App() {
  const dispatch = useDispatch();
  const { data, sortOrder, currentPage, searchKeyword } = useSelector((state) => state);

  const totalPagesRef = useRef(1);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    dispatch(fetchPhonebooks(currentPage, sortOrder, searchKeyword))
      .then((totalPages) => {
        totalPagesRef.current = totalPages;
        isLoadingRef.current = false;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, currentPage, sortOrder, searchKeyword]);

  const handleAddContact = async (name, phone) => {
    try {
      await dispatch(addContact(name, phone));
      window.location.reload();
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
      if (currentPage < totalPagesRef.current && !isLoadingRef.current) {
        isLoadingRef.current = true;
        dispatch(setCurrentPage(currentPage + 1));
      }
    }
  }, [currentPage, totalPagesRef, isLoadingRef, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="container">
      <header>
        <PhoneHeader
          handleAddContact={handleAddContact}
          sortOrder={sortOrder}
          setSortOrder={(order) => dispatch({ type: "SET_SORT_ORDER", payload: order })}
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
