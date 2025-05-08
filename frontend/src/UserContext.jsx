import { useState, createContext } from "react";
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to store user data
    const [excelData, setExcelData] = useState(null);


    return (
        <UserContext.Provider value={{ user, setUser, excelData, setExcelData }}>
            {children}
        </UserContext.Provider>
    );
}