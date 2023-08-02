import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:3001/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

const loadPhonebooksSuccess = (data, totalPages) => ({ type: "LOAD_PHONEBOOKS_SUCCESS", data, totalPages })
const loadPhonebooksFailure = () => ({ type: "LOAD_PHONEBOOKS_FAILURE" })

export const fetchPhonebooks = (page, sortOrder, keyword = "") => async (dispatch, getState) => {
    dispatch({ type: "LOAD_PHONEBOOKS_REQUEST" }); // Set isLoading to true
    try {
        const response = await request.get("api/phonebooks", {
            params: { sort: sortOrder, page, keyword },
        });

        // Combine existing data with new data when fetching additional pages
        const existingData = getState().phonebook.data; // Update this line
        const newData = page === 1 ? response.data.phonebooks : [...existingData, ...response.data.phonebooks];

        dispatch(loadPhonebooksSuccess(newData, response.data.pages));
        return response.data.pages;
    } catch (error) {
        dispatch(loadPhonebooksFailure());
        throw error; // Rethrow the error to the caller
    }
};
//END OF FETCH / LOAD DATA

const addContactSuccess = (contact) => ({ type: "ADD_CONTACT_SUCCESS", payload: contact });
const addContactFailure = () => ({ type: "ADD_CONTACT_FAILURE" });

export const addContact = (name, phone) => async (dispatch) => {
    try {
        const response = await request.post("api/phonebooks", {
            name: name,
            phone: phone,
        });
        dispatch(addContactSuccess(response.data)); // Pass the response.data as the payload
    } catch (error) {
        dispatch(addContactFailure());
        throw error;
    }
};
//END OF ADD CONTACT

const updateContactSuccess = (id, name, phone) => ({ type: 'UPDATE_CONTACT_SUCCESS', payload: { id, name, phone } });
const updateContactFailure = () => ({ type: 'UPDATE_CONTACT_FAILURE'});

export const updateContact = (id, name, phone) => async (dispatch) => {
    try {
        await request.put(`api/phonebooks/${id}`, {
            name: name,
            phone: phone,
        });
        dispatch(updateContactSuccess(id, name, phone)); // Pass the updated contact details as the payload
    } catch (error) {
        console.error('Error updating contact:', error);
        dispatch(updateContactFailure());
        throw error;
    }
};
// END OF EDIT / UPDATE CONTACT


const deleteContactSuccess = (id) => ({ type: 'DELETE_CONTACT_SUCCESS', payload: id });
const deleteContactFailure = () => ({ type: 'DELETE_CONTACT_FAILURE'});

export const deleteContact = (id) => async (dispatch) => {
  try {
    await request.delete(`api/phonebooks/${id}`);
    dispatch(deleteContactSuccess(id)); // Pass the id of the deleted contact as the payload
  } catch (error) {
    console.error('Error deleting contact:', error);
    dispatch(deleteContactFailure());
    throw error;
  }
};
// END OF DELETE CONTACT

export const setSearchKeyword = (keyword) => ({
    type: "SET_SEARCH_KEYWORD",
    payload: keyword,
});

export const setCurrentPage = (page) => ({
    type: "SET_CURRENT_PAGE",
    payload: page,
});

export const setSortOrder = (sortOrder) => ({
    type: "SET_SORT_ORDER",
    payload: sortOrder,
});