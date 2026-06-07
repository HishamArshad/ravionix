"use client";

import { useEffect } from "react";

export default function Page() {

  useEffect(() => {

    const socket =
      new WebSocket(
        "ws://127.0.0.1:8000/ws/notifications/"
      );

    socket.onopen = () => {
      console.log("Connected");

      socket.send(
        JSON.stringify({
          message: "Hello Django"
        })
      );
    };

    socket.onmessage = (
      event
    ) => {
      console.log(
        JSON.parse(event.data)
      );
    };

    socket.onclose = () => {
      console.log("Disconnected");
    };

    return () => {
      socket.close();
    };

  }, []);

  return (
    <div>
      WebSocket Test
    </div>
  );
}