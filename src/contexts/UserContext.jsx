import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAuth = localStorage.getItem('user');
        if (storedAuth) {
            setUser(JSON.parse(storedAuth));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    if (loading) return <div>Loading...</div>; // 🔒 Prevent premature rendering

    return (
        <UserContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
