'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns';

interface CountdownProps {
  date: string; // Espera uma string ISO (ex: 2026-02-28T23:59:00)
}

export default function Countdown({ date }: CountdownProps) {
  // Estado inicial null para evitar erro de Hidratação (Hydration Mismatch)
  // O servidor renderiza nada, e o cliente preenche assim que montar.
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<'normal' | 'soon' | 'ended'>('normal');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const deadline = parseISO(date); // Converte a string ISO seguramente

      // Diferenças brutas
      const days = differenceInDays(deadline, now);
      const hours = differenceInHours(deadline, now) % 24;
      const minutes = differenceInMinutes(deadline, now) % 60;

      // Lógica de Exibição
      if (days < 0 && hours <= 0 && minutes <= 0) {
        setTimeLeft("Deadline Ended");
        setUrgency('ended');
        return;
      }

      // Definindo a urgência para cores
      if (days < 3) {
        setUrgency('soon'); // Menos de 3 dias = Urgente
      } else {
        setUrgency('normal');
      }

      // Formatação da String
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left 🔥`);
      } else {
        setTimeLeft(`${minutes}m left 🚨`);
      }
    };

    // Calcula imediatamente ao montar
    calculateTime();

    // Atualiza a cada minuto (60000ms) para não pesar a CPU
    const timer = setInterval(calculateTime, 60000);

    // Limpeza ao desmontar componente
    return () => clearInterval(timer);
  }, [date]);

  // Enquanto não carrega no cliente, mostra um placeholder invisível ou de carregamento
  // para manter o layout estável
  if (timeLeft === null) {
    return <span className="text-slate-600 animate-pulse">--:--</span>;
  }

  // Definição de Cores baseado no Dark Mode
  const colorMap = {
    normal: 'text-emerald-400', // Verde Neon
    soon: 'text-amber-400',     // Amarelo/Laranja
    ended: 'text-slate-500 line-through'      // Cinza riscado
  };

  return (
    <span className={`font-mono font-bold tracking-tight ${colorMap[urgency]}`}>
      {timeLeft}
    </span>
  );
}