import { ALERT_TYPE } from "react-native-alert-notification";
import { ToastNotification } from "../components/alert";

export function getErrorToast(error: any) {
    if (error.message === "PERMISSION_DENIED")
        ToastNotification(ALERT_TYPE.SUCCESS, "Permissão necessária", "Habilite as permissões de Bluetooth e Localização para continuar");
    
    if (error.message === "BLUETOOTH_OFF")
        ToastNotification(ALERT_TYPE.WARNING, "Bluetooth desligado", "Ative o Bluetooth para conectar ao dispositivo");
    
    else if(error.message === "DEVICE_NOT_FOUND")
        ToastNotification(ALERT_TYPE.DANGER, "Dispositivo não encontrado", "Verifique se o dispositivo está ligado e próximo");
    
    else if(error.message === "INVALID_QRCODE")
        ToastNotification(ALERT_TYPE.WARNING, "QRCode inválido", "Verifique se o QRCode é do dispositivo");
    
    else
        ToastNotification(ALERT_TYPE.DANGER, "Erro inesperado", "Não foi possível conectar ao dispositivo");
}