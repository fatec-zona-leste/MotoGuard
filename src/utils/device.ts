import { TypeSensor } from "../types";

const names: Record<TypeSensor, string> = {
  [TypeSensor.IMPACT_SENSOR]: "Dispositivo do capacete",
  [TypeSensor.REAR_SENSOR]: "Sensor traseiro"
};

const descriptions: Record<TypeSensor, string> = {
  [TypeSensor.IMPACT_SENSOR]: "Sensor de impacto que envia alerta para contato de emergencia",
  [TypeSensor.REAR_SENSOR]: "Sensor de distância que verifica objetos atrás da moto"
};

export function getNameDevice(type: TypeSensor){
    return names[type]
}

export function getDescriptionDevice(type: TypeSensor){
    return descriptions[type]
}

export function getTypeByBluetoothName(type: string): TypeSensor{
    if(type.includes(TypeSensor.REAR_SENSOR)) return TypeSensor.REAR_SENSOR
    return TypeSensor.REAR_SENSOR;
}