import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from 'react-native';
import { ALERT_TYPE } from "react-native-alert-notification";
import { ToastNotification } from "../components/alert";
import { UserData } from "../types";

const AuthContextData = {
    signed: false,
    user: {} as UserData | null,
    token: "" as string | null,
    login: async (email: string, password: string) => { },
    register: async (email: string, password: string) => { },
    logout: () => { },
}


const AuthContext = createContext(AuthContextData);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    async function login(email: string, password: string) {
        try {
            setUser({email, password});
            setToken("secret");
        } catch (error) {
            throw error;
        }
    }

    async function register(email: string, password: string) {
        try {
            
        } catch (error) {
            throw error;
        }
    }

    async function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
