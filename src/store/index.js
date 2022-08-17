import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../reducers/filters';
import ReduxThunk from 'redux-thunk';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const stringMiddleware = () => (next) => (action) => {
    if(typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action);
}

//принимает аргумет, который может приходить строкой 
const enhancer = ( createStore ) => (...args) => {
    const store = createStore(...args);

    const oldDispatch = store.dispatch;
    store.dispatch = (action) => {
        if(typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }
        return oldDispatch(action);
    }
    return store;
}

//combineReduser необходим для соединения несколько редюсеров, для совместной работы
// const store = createStore( combineReducers({heroes, filters},
//             //Соединяет несколько функций, порядок вызова имеет значение
//             compose(
//                 // enhancer,
//                 applyMiddleware(ReduxThunk, stringMiddleware),
//                 window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//             )), 
// );

const store = configureStore ({
    reducer: {
        heroes, filters
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV != 'production', 
})

export default store;