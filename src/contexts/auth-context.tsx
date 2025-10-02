import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from 'react-native';
import { ALERT_TYPE } from "react-native-alert-notification";
import { ToastNotification } from "../components/alert";
import { UserData } from "../types";
import { deleteAccountService, updatePasswordService, updateProfileService, loginService, updateEmergencyContactService, registerService, updateService, validateExistEmailService } from "../services/auth-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContextData = {
    signed: false,
    user: {} as UserData | null,
    token: "" as string | null,
    login: async (email: string, password: string) => { },
    register: async (email: string, password: string, name: string, number: string | null) => { },
    updateProfile: async (token: string, email: string, name: string) => { },
    updateEmergencyContact: async (token: string, emergency_number: string) => { },
    updatePassword: async (token: string, old_password: string, password: string) => { },
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

    async function register(email: string, password: string, name: string, number: string | null) {
        return await registerService(email, password, name, number);
    }

    async function validateExistEmail(email: string) {
        return await validateExistEmailService(email);
    }

    async function updateProfile(token: string, email: string, name: string) {
        const response = await updateProfileService(token, email, name);
        if (response.user) {
            setUser(response.user);
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
        }
    }

    async function updateEmergencyContact(token: string, emergency_number: string) {
        const response = await updateEmergencyContactService(token, emergency_number);
        if (response.user) {
            setUser(response.user);
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
        }
    }

    async function updatePassword(token: string, old_password: string, password: string) {
        const response = await updatePasswordService(token, old_password, password);
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
        <AuthContext.Provider value={{ signed: !!user, user, token, login, logout, updateEmergencyContact, register, updateProfile, updatePassword, deleteAccount, validateExistEmail }}>
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
