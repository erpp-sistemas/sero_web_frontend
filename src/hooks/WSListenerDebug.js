// 🔹 Debug WebSocket en tiempo real
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cleanMessages } from "../redux/socketSlice";

function WSListenerDebug() {
  const messages = useSelector((state) => state.webSocket.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    console.log("📡 Mensajes recibidos del WS:", messages);

    // Mostrar solo el último mensaje
    const latestMessage = messages[messages.length - 1];
    console.log("🧩 Último mensaje WS:", latestMessage);

    // Limpiar mensajes para no repetir
    dispatch(cleanMessages());
  }, [messages, dispatch]);

  return null; // No renderiza nada
}

export default WSListenerDebug;
