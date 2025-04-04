import { createContext, useReducer, useEffect} from 'react'

export const APIContext = createContext()

export const APIReducer = (state, action) => {
    switch (action.type) {
        case 'SET_KEYS': 
            return { keys: action.payload }
        case 'GENERATE_KEYS':
            return { keys: [...state.keys, action.payload]}
        default:
            return state
    }
}

export const APIContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(APIReducer, {
        keys: null
    })

    return (
        <APIContext.Provider value={{...state, dispatch}}>
            { children }
        </APIContext.Provider>
    )
}