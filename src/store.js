import { createStore } from 'redux';

const initialState = {
    loggedIn: false
};

let reducer = (state, action) => {
    if (action.type === "login-success") {
        return { ...state, loggedIn: true };
    }
    if (action.type === "logout-success") {
        return { ...state, loggedIn: false };
    }
    return state;
};

const store = createStore(
    reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default store;