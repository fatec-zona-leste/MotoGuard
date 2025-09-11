import axios from "axios";
import { API_URL } from "../utils/util";
import { useAuth } from "../contexts/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function instance(token?: string) {
    return axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer. ${token}`,
        }
    });
} 