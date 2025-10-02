import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from 'react-native';
import { ALERT_TYPE } from "react-native-alert-notification";
import { ToastNotification } from "../components/alert";
import { UserData } from "../types";
import { deleteAccountService, loginService, registerService, updateService, validateExistEmailService } from "../services/auth-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContextData = {
    signed: false,
    user: {} as UserData | null,
    token: "" as string | null,
    login: async (email: string, password: string) => { },
    register: async (email: string, password: string, name: string, number: string) => { },
    update: async (token: string, email: string, password: string, name: string, number: string, old_passwod?: string) => { },
    validateExistEmail: async (email: string) => true,
    logout: () => { },
    deleteAccount: (token: string) => { },
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
        return await registerService(email, password, name, number);
    }

    async function validateExistEmail(email: string) {
        return await validateExistEmailService(email);
    }

    async function update(token: string, email: string, password: string, name: string, number: string, old_passwod?: string) {
        const response = await updateService(token, email, password, name, number, old_passwod);
        if (response.user) {
            setUser(response.user);
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
        }
    }

    async function logout() {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
    }

    async function deleteAccount(token: string) {
        if(!user) return;
        await deleteAccountService(token, user?.id);
        ToastNotification(ALERT_TYPE.SUCCESS, "Conta excluida", "Seus dados foram removidos");
        await logout()
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, token, login, logout, update, register, deleteAccount, validateExistEmail }}>
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
