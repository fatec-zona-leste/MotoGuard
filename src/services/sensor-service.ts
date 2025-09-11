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
    
export async function verifyImpact(a_sqrt: number) {
    if (a_sqrt > IMPACT_LIMIT) {
        return true;
    };
    return false;
}

export async function save(token: string, bluetooth_name: string, service_uuid: string, characteristic_uuid: string, type: TypeSensor) {
    return await instance(token).post('/devices', { bluetooth_name, service_uuid, characteristic_uuid, type });
}

export const sendAlert = async (token: string | null, device_id: number) => {
    if(!token) return;
     const position = await new Promise<Geolocation.GeoPosition>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        resolve,
        reject,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });

    const { latitude, longitude } = position.coords;

    return await instance(token).post('/devices/alert', { device_id, latitude, longitude });
}