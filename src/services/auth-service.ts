import axios from "axios";
import { API_URL } from "../utils/util";
import instance from "./api";

export async function loginService(email: string, password: string) {
    try {
        const response = await instance().post('/users/login', { email, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function registerService(email: string, password: string, name: string, number: string | null) {
    try {
        const response = await instance().post('/users', { email, password, name, emergency_number: number });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function updateService(token: string, email: string, password: string, name: string, number: string, old_passwod?: string) {
    try {
        const response = await instance(token).patch('/users', { email, password, password_confirmation: password, name, emergency_number: number, old_passwod });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function updateProfileService(token: string, email: string, name: string) {
    try {
        const response = await instance(token).patch('/users/info', { email, name });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function updateEmergencyContactService(token: string, emergency_number: string) {
    try {
        const response = await instance(token).patch('/users/contact', { emergency_number });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function updatePasswordService(token: string, old_password: string, password: string) {
    try {
        const response = await instance(token).patch('/users/password', { old_password, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function deleteAccountService(token: string, id: number) {
    try {
        const response = await instance(token).delete(`/users/${id}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function validateExistEmailService(email: string) {
    try {
        const response = await instance().post(`/users/validate-email`, { email });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}