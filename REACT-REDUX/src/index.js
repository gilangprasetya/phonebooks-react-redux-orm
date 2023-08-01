import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/phonebooks";
import App from "./App";

const store = createStore(rootReducer, applyMiddleware(thunk));

// Use createRoot from react-dom/client instead of ReactDOM.render
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
