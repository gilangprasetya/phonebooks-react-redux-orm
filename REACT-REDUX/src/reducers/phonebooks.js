const initialState = {
    data: [], // Add a default value of an empty array
    sortOrder: "asc",
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    searchKeyword: "",
    updateError: null,
    deleteError: null,
};


const phonebookReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_PHONEBOOKS_REQUEST":
            return {
                ...state,
                isLoading: true,
            };

        case "LOAD_PHONEBOOKS_SUCCESS":
            return {
                ...state,
                data: action.data,
                totalPages: action.totalPages,
                isLoading: false,
            };

        case "LOAD_PHONEBOOKS_FAILURE":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        case "ADD_CONTACT_SUCCESS":
            return {
                ...state,
                data: [...state.data, action.payload],
            };

        case "ADD_CONTACT_FAILURE":
            return {
                ...state,
                error: action.payload,
            };

        case "SET_SEARCH_KEYWORD":
            return {
                ...state,
                data: [],
                searchKeyword: action.payload,
                currentPage: 1,
            };

        case "SET_CURRENT_PAGE":
            return {
                ...state,
                currentPage: action.payload,
            };

        case "SET_SORT_ORDER":
            return {
                ...state,
                sortOrder: action.payload,
                currentPage: 1,
            };

        case 'UPDATE_CONTACT_SUCCESS':
            const updatedData = state.data.map((contact) => {
                if (contact.id === action.payload.id) {
                    return {
                        ...contact,
                        name: action.payload.name,
                        phone: action.payload.phone,
                    };
                }
                return contact;
            });
            return {
                ...state,
                updateError: null,
                data: updatedData,
            };

        case 'UPDATE_CONTACT_FAILURE':
            return {
                ...state,
                updateError: action.payload,
            };

        case 'DELETE_CONTACT_SUCCESS':
            const filteredData = state.data.filter((contact) => contact.id !== action.payload);
            return {
                ...state,
                deleteError: null,
                data: filteredData,
            };

        case 'DELETE_CONTACT_FAILURE':
            return {
                ...state,
                deleteError: action.payload,
            };

        default:
            return state;
    }
};

export default phonebookReducer;  