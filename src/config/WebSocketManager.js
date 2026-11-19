import { setSocket, addMessage } from '../redux/socketSlice';

const RECONNECT_INTERVAL = 5000;

export const initializeWebSocket = (dispatch) => {

    let socket;
    let reconnectAttempts = 0;

    const connect = () => {

        const url = import.meta.env.VITE_WS_URL;

        socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket connected');
            reconnectAttempts = 0;
            dispatch(setSocket(socket));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            dispatch(addMessage(data));
        };

        socket.onclose = () => {
            //console.log('WebSocket disconnected');
            dispatch(setSocket(null));
            attemptReconnect();
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            socket.close();
        };
    }

    const attemptReconnect = () => {
        if (reconnectAttempts < 10) { // Número máximo de intentos de reconexión
            reconnectAttempts++;
            //console.log(`Reconnection attempt #${reconnectAttempts}`);
            setTimeout(connect, RECONNECT_INTERVAL);
        } else {
            //console.error('Maximum reconnection attempts reached');
        }
    };

    connect();

};


