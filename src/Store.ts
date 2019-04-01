import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from "redux-thunk";

import {reducer as QueryReducer} from "./QueryRedux";
const INITIAL_STATE = {};
export const Store = createStore(
    combineReducers({
        query: QueryReducer,
    }),
    INITIAL_STATE,
    applyMiddleware(ReduxThunk)
);