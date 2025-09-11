import { ALERT_TYPE } from "react-native-alert-notification";
import { ToastNotification } from "../components/alert";

export function getErrorToast(error: any) {
    if (error.message === "PERMISSION_DENIED")
        ToastNotification(ALERT_TYPE.SUCCESS, "Permissão necessária", "Habilite as permissões de Bluetooth e Localização para continuar");
    
    if (error.message === "BLUETOOTH_OFF")
        ToastNotification(ALERT_TYPE.WARNING, "Bluetooth desligado", "Ative o Bluetooth para conectar ao dispositivo");
    
    else if(error.message === "DEVICE_NOT_FOUND")
        ToastNotification(ALERT_TYPE.DANGER, "Dispositivo não encontrado", "Verifique se o dispositivo está ligado e próximo");
    
    else if(error.message === "DEVICE_DISCONNECTED")
        ToastNotification(ALERT_TYPE.DANGER, "Dispositivo desconectado", "Verifique se o dispositivo está ligado e próximo");
    
    else if(error.message === "INVALID_QRCODE")
        ToastNotification(ALERT_TYPE.WARNING, "QRCode inválido", "Verifique se o QRCode é do dispositivo");

    else if(error.status === 401)
        ToastNotification(ALERT_TYPE.WARNING, "Sessão expirada", "Faça login novamente");
    
    else if(error.status === 403)
        ToastNotification(ALERT_TYPE.WARNING, "Acesso negado", "Você não tem permissão para realizar essa ação");
    
    else if(error.status === 429)
        ToastNotification(ALERT_TYPE.WARNING, "Muitas requisições", "Aguarde um pouco e tente novamente");
    
    else
        ToastNotification(ALERT_TYPE.DANGER, "Erro inesperado", "Tente novamente mais tarde");
}