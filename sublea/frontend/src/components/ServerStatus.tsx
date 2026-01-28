import {useEffect, useState } from "react";
import apiClient from "../api/client";

export default function ServerStatus() {
    const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
    const [message, setMessage] = useState<string>("");


    useEffect(() => {
        apiClient.get("/")
            .then((response) => {
                setStatus("online");
                setMessage(response.data.message || "Connected");

            })
            .catch((error) => {
                setStatus("offline");
                setMessage(error.message);
            });
    }, []);
    
    if (status === "loading") {
        return (
            <div className="p-4 bg-blue-100 text-blue-800 rounded-lg border border-blue-300">
                Connecting to Sublea API...
            </div>
        );
    }

    if (status === "offline") {
        return (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
                <div className="font-semibold">Backend Unavailable</div>
                <div className="text-sm mt-1">{message}</div>
                <div className="text-xs mt-2 text-red-600">
                    Make sure backend is running at: {import.meta.env.VITE_API_URL}
                </div>
            </div>
        );
    }
    

    return (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
            <div className="font-semibold">Backend Connected</div>
            <div className="text-sm mt-1">{message}</div>
        </div>
    );
    
};

