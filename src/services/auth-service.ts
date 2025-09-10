import axios from "axios";
import { API_URL } from "../utils/util";

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


export async function loginService(email: string, password: string) {
    try {
        const response = await instance.post('/users/login', { email, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data.length ? error.response.data[0] : error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}

export async function registerService(email: string, password: string, name: string, number: string) {
    try {
        const response = await instance.post('/users', { email, password, name, emergency_number: number });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
            throw error.response.data.length ? error.response.data[0] : error.response.data;
        } else {
            console.log('Erro sem response:', error.message);
            throw error;
        }
    }
}