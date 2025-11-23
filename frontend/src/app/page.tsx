"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MotorScene from "../components/Motor3D";

// Connect to NestJS (Default Port 3001)
const socket = io("https://super-duper-succotash-66546q6vrp535jjj-3001.app.github.dev/");

interface MotorData {
  device_id: string;
  timestamp: number;
  temperature: number;
  vibration: number;
  status: string;
}

export default function Home() {
  const [data, setData] = useState<MotorData>({
    device_id: "Connecting...",
    timestamp: Date.now(),
    temperature: 0,
    vibration: 0,
    status: "OFFLINE",
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setConnected(false);
    });

    // Listen for the event name we defined in NestJS (events.gateway.ts)
    socket.on("motor_update", (payload: MotorData) => {
      setData(payload);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("motor_update");
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Industrial Digital Twin
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time Telemetry Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
            <span className="text-sm font-mono text-slate-300">
              {connected ? "SYSTEM ONLINE" : "DISCONNECTED"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats */}
          <div className="space-y-4">
            <StatCard label="Device ID" value={data.device_id} />
            <StatCard 
              label="Temperature" 
              value={`${data.temperature.toFixed(1)}°C`} 
              alert={data.temperature > 50} 
            />
            <StatCard 
              label="Vibration" 
              value={`${data.vibration.toFixed(3)} G`} 
              alert={data.vibration > 1.0} 
            />
            <StatCard label="Status" value={data.status} />
          </div>

          {/* Right Column: 3D Scene (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <MotorScene data={data} />
            <p className="text-xs text-slate-500 mt-2 text-center">
              Interactive 3D Model • Rotates & Changes Color on Alert
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}

// Simple Utility Component for UI
function StatCard({ label, value, alert = false }: { label: string, value: string | number, alert?: boolean }) {
  return (
    <div className={`p-6 rounded-xl border transition-colors ${
      alert 
        ? "bg-red-900/20 border-red-500/50" 
        : "bg-slate-900 border-slate-800"
    }`}>
      <h3 className="text-slate-400 text-sm uppercase tracking-wider">{label}</h3>
      <p className={`text-2xl font-mono font-bold mt-1 ${alert ? "text-red-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}