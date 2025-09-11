import { TypeSensor } from "../types";
import instance from "./api";
import Geolocation from 'react-native-geolocation-service';

const IMPACT_LIMIT = 2.5;

export async function index(token: string){
    return await instance(token).get('/devices');
}

export async function destroy(token: string, id: number){
    return await instance(token).delete(`/devices/${id}`);
}
    
export async function verifyImpact(a_sqrt: number, device_id = 0) {
    if (a_sqrt > IMPACT_LIMIT) {
        await sendAlert(device_id);
        return true;
    };
    return false;
}

export async function save(token: string, bluetooth_name: string, service_uuid: string, characteristic_uuid: string, type: TypeSensor) {
    return await instance(token).post('/devices', { bluetooth_name, service_uuid, characteristic_uuid, type });
}

const sendAlert = (device_id: number) => {
    Geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            instance().post('/devices/alert', { device_id, latitude, longitude });
        },
        (error) => {
            throw error;
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
        }
    );
}