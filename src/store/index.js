import { createStore } from "redux";


const initialState = {
    counter: 0,
    showCounter: true,
};

const reducer = (state = initialState, action) => {
    if (action.type === "INCREMENT") {
        return {
            ...state,
            counter: state.counter + 1,
        };
    }
    if (action.type === "DECREMENT") {
        return {
            ...state,
            counter: state.counter - 1,
        };
    }
    if (action.type === "INCREASE") {
        return {
            ...state,
            counter: state.counter + action.payload,
        };
    }
    if (action.type === "TOGGLE") {
        return {
            ...state,
            showCounter: !state.showCounter,
        };
    }
    return state;
};

const store = createStore(reducer);

export default store;
