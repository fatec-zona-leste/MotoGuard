import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from 'react-native';
import { ALERT_TYPE } from "react-native-alert-notification";
import { ToastNotification } from "../components/alert";
import { UserData } from "../types";
import { loginService, registerService } from "../services/auth-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContextData = {
    signed: false,
    user: {} as UserData | null,
    token: "" as string | null,
    login: async (email: string, password: string) => { },
    register: async (email: string, password: string, name: string, number: string) => { },
    logout: () => { },
}


const AuthContext = createContext(AuthContextData);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        async function loadStorage() {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("token");
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        }
        loadStorage();
    }, []);

    async function login(email: string, password: string) {
        const response = await loginService(email, password);

        setUser(response.user);
        setToken(response.token);

        await AsyncStorage.setItem("user", JSON.stringify(response.user));
        await AsyncStorage.setItem("token", response.token);
    }

    async function register(email: string, password: string, name: string, number: string) {
        const response = await registerService(email, password, name, number);
    }

    async function logout() {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem("@App:user");
        await AsyncStorage.removeItem("@App:token");
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
