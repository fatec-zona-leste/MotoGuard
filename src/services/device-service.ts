import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middleware";
import Device from "../models/Device";

export async function index(req: AuthRequest, res: Response) {
    try {
        const devices = await Device.findAll({ where: { user_id: req.user?.id } });
        res.json({ devices: devices });
    } catch (err) {
        res.status(500).json({message: "Erro ao listar sensores", error: err instanceof Error ? err.message : err });
    }
}

export async function register(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.id;
        const { bluetooth_name, service_uuid, characteristic_uuid, type } = req.body;
        console.log(user_id);
        

        //se sensor já existe, atualiza
        const existingDevice = await Device.findOne({ where: { bluetooth_name: bluetooth_name, user_id: user_id } });
        if (existingDevice) {
            existingDevice.set({
                bluetooth_name,
                service_uuid,
                characteristic_uuid,
                type
            });
            return res.status(200).json({ message: "Dispositivo atualizado", device: existingDevice });
        }
        
        const device = await Device.create({
            user_id,
            bluetooth_name,
            service_uuid,
            characteristic_uuid,
            type
        });
        
        res.status(201).json({ message: `Sensor cadastrado`, device });
    } catch (err) {
        res.status(500).json({message: "Erro ao cadastrar sensor", error: err instanceof Error ? err.message : err });
    }
}

export async function update(req: AuthRequest, res: Response) {
    try {
        const { id, bluetooth_name, service_uuid, characteristic_uuid, type } = req.body;

        const existingDevice = await Device.findOne({ where: { id: id } });
        if (!existingDevice) return res.status(404).json({ message: "Dispositivo não encontrado" });
        
        if(req.user?.id !== existingDevice.get("user_id")) return res.status(403).json({ message: "Acesso negado" });

        existingDevice.set({
            bluetooth_name,
            service_uuid,
            characteristic_uuid,
            type
        });
        return res.status(200).json({ message: "Dispositivo atualizado", device: existingDevice });
    } catch (err) {
        res.status(500).json({message: "Erro ao atualizar sensor", error: err instanceof Error ? err.message : err });
    }
}

export async function destroy(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;

        const existingDevice = await Device.findOne({ where: { id: id } });
        if (!existingDevice) return res.status(404).json({ message: "Dispositivo não encontrado" });
        
        if(req.user?.id !== existingDevice.get("user_id")) return res.status(403).json({ message: "Acesso negado" });

        existingDevice.destroy();
        return res.status(200).json({ message: "Dispositivo removido", device: existingDevice });
    } catch (err) {
        res.status(500).json({message: "Erro ao remover sensor", error: err instanceof Error ? err.message : err });
    }
}