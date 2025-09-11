import { Response } from "express";
import Alert from "../models/Alert";
import { AuthRequest } from "../middlewares/auth-middleware";
import { sendEmergencyMessage } from "./message-service";
import User from "../models/User";
import Device from "../models/Device";

export async function send(req: AuthRequest, res: Response){
    try {
        const { device_id, latitude, longitude } = req.body;
        const user_id = req.user?.id;
        const user = await User.findByPk(user_id);

        const device = await Device.findOne({ where: { id: device_id } });
        if (!device) return res.status(404).json({ message: "Dispositivo não encontrado" });
        if(user_id !== device.get("user_id")) return res.status(403).json({ message: "Acesso negado" });

        const alert = await Alert.create({
            user_id: user_id,
            device_id,
            latitude: latitude || null,
            longitude: longitude || null
        });

        if(user?.get("emergency_number") && user?.get("emergency_number")?.length){
            await sendEmergencyMessage(user, latitude, longitude);
            return res.status(201).json({ message: "Alerta enviado", alert });
        }

        return res.status(201).json({ message: "Usuário não possui contato de emergência", alert });
    } catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : "Erro ao enviar alerta" });
    }
}