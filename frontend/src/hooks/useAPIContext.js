import { APIContext } from "../context/APIContext";
import { useContext } from "react";

export const useAPIContext = () => {
    const context = useContext(APIContext)

    if (!context) {
        throw Error('useAPIContext must be used inside an APIContextProvider')
    }

    return context
}