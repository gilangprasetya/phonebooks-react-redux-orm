import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:3001/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

export const fetchPhonebooks = (page, sortOrder, keyword = "") => async (dispatch, getState) => {
    dispatch({ type: "LOAD_PHONEBOOKS_REQUEST" }); // Set isLoading to true
    try {
        const response = await request.get("api/phonebooks", {
            params: { sort: sortOrder, page, keyword },
        });

        // Combine existing data with new data when fetching additional pages
        const existingData = getState().data;
        const newData = page === 1 ? response.data.phonebooks : [...existingData, ...response.data.phonebooks];

        dispatch({ type: "LOAD_PHONEBOOKS_SUCCESS", payload: { data: newData, totalPages: response.data.pages } });
        return response.data.pages;
    } catch (error) {
        dispatch({ type: "LOAD_PHONEBOOKS_FAILURE", payload: error.message });
        throw error; // Rethrow the error to the caller
    }
};

export const addContact = (name, phone) => async (dispatch) => {
    try {
        const response = await request.post("api/phonebooks", {
            name: name,
            phone: phone,
        });
        dispatch({ type: "ADD_CONTACT_SUCCESS", payload: response.data });
    } catch (error) {
        dispatch({ type: "ADD_CONTACT_FAILURE", payload: error.message });
        throw error;
    }
};

export const updateContact = (id, name, phone) => async (dispatch) => {
    try {
        await request.put(`api/phonebooks/${id}`, {
            name: name,
            phone: phone,
        });
        dispatch({ type: 'UPDATE_CONTACT_SUCCESS', payload: { id, name, phone } });
    } catch (error) {
        console.error('Error updating contact:', error);
        dispatch({ type: 'UPDATE_CONTACT_FAILURE', payload: error.message });
        throw error;
    }
};

// New action for deleting a contact
export const deleteContact = (id) => async (dispatch) => {
    try {
        await request.delete(`api/phonebooks/${id}`);
        dispatch({ type: 'DELETE_CONTACT_SUCCESS', payload: id });
    } catch (error) {
        console.error('Error deleting contact:', error);
        dispatch({ type: 'DELETE_CONTACT_FAILURE', payload: error.message });
        throw error;
    }
};

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