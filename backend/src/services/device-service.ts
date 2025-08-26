import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middleware";

export function index(req: AuthRequest, res: Response) {
    const devices = [{ id: 1, mac_address: "00:1B:44:11:3A:B7", user_id: req.user?.id, sensor: "IMPACT_SENSOR" }];

    res.json({ devices: devices });
}

export function register(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { deviceName } = req.body;
    console.log(userId, deviceName);
    
    res.json({ message: `Sensor cadastrado` });
}