# 🏍️ MotoGuard: IoT para prevenção de colisões de motocicletas

Este projeto propõe uma solução baseada em Internet das Coisas (IoT) para diminuir o índice de acidentes de trânsitos com motocicletas. 

## 📌 Objetivo

O objetivo do MotoGuard é desenvolver um dispositivo inteligente para motociclistas, focando na detecção de pontos cegos e emissão de alertas em tempo real. Utilizando o IoT, o sistema integra sensores de aproximação para identificar riscos de colisões, assim, emitindo um alerta ao condutor, auxiliando na tomada de decisão, percepção do condutor e reduzindo a probablidade de acidentes.

## 🧠 Justificativa
Motociclistas representam um dos grupos mais vulneráveis no trânsito, especialmente em áreas urbanas como São Paulo. Fatores como:

- Baixa visibilidade lateral
- Falta de dispositivos tecnológicos acessíveis
- Aumento da frota de motocicletas contribuem para os altos índices de acidentes fatais. O MotoGuard propõe uma solução proativa (e não apenas reativa), prevenindo riscos antes que se tornem acidentes.

## 🎯 Público-alvo
- Entregadores por aplicativo
- Profissionais que usam a motocicleta como meio de transporte
- Usuários em centros urbanos com alto tráfego

## ⚙️ Componentes utilizados
- **ESP32-C3**:	Microcontrolador com Wi-Fi/Bluetooth
- **Sensor infravermelho**:	Detecção de veículos em pontos cegos
- **MPU9250 (IMU)**:	Detecção de quedas e impactos
- **Bateria Li-Po + TP4056**:	Fonte de energia recarregável

## ⚙️ Tecnologias utilizadas
- **React Native**:	Aplicativo para visualização e alertas
- **Node.js + TypeScript**:	Backend e integração com WhatsApp

## 📱 Funcionalidades
✅Detecção de veículos nos pontos cegos<br>
✅Alertas visuais e sonoros no celular<br>
✅Notificação automática em caso de queda<br>
✅Envio da localização via WhatsApp em emergências<br>
✅Aplicativo com interface intuitiva<br>
✅Dashboard para administradores com estatísticas de uso e acidentes

## 🧪 Metodologia
- Pesquisa qualitativa e exploratória
- Levantamento de dados sobre acidentes com motociclistas
- Estudo de tecnologias IoT aplicadas à segurança veicular
- Prototipagem com testes em ambiente controlado
- Análise de concorrentes e diferenciais

## 🔗 Links

- [Documentos e apresentações](https://github.com/fatec-zona-leste/MotoGuard/tree/main/documentos)
- [API do MotoGuard](https://github.com/fatec-zona-leste/MotoGuard/tree/main/message-api)
- [Aplicativo do MotoGuard](https://github.com/fatec-zona-leste/MotoGuard/tree/main/MotoGuardApp)
- [IoT](https://github.com/fatec-zona-leste/MotoGuard/tree/main/iot)

## 🧑‍🔬 Equipe

- Bruno Costa Rezende [Github](https://github.com/BrunoCRezende)
  - Responsável pelo design e desenvolvimento front-end do aplicativo
- João Enrique Barbosa Santos Alves [Github](https://github.com/JoaoEnrique)
  - Responsável pelo desenvolvimento back-end e integração dos sensores
- Sarah Jandozza Laurindo [Github](https://github.com/Sarahjl)
  - Responsável pelo levantamento bibliográfico e escrita do referencial teórico 


## 📚 Referências

- Senatran, Infosiga, IBGE, entre outros.

---

> Projeto desenvolvido na FATEC Zona Leste - Curso de Análise e Desenvolvimento de Sistemas.
