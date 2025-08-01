"use client"
import { NumberInput, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { type ParametrosSimulacionUI } from "../simulacion/tipos";

interface Props {
  onChange: (valores: ParametrosSimulacionUI) => void;
}

export function ParametrosSimulacionForm({ onChange }: Props) {
  const [duracionHoras, setDuracionHoras] = useState(100);
  const [desde, setDesde] = useState(0);
  const [hasta, setHasta] = useState(50);
  const [filasAMostrar, setFilasAMostrar] = useState(2);

  // Emitir cambios al padre cada vez que cambie algo
  useEffect(() => {
    onChange({ duracionHoras, desde, hasta, filasAMostrar });
  }, [duracionHoras, desde, hasta, filasAMostrar, onChange]);

  return (
    <Stack>
      <NumberInput
        label="Duración de la simulación (horas)"
        value={duracionHoras}
        onChange={(v) => setDuracionHoras(typeof v === "number" ? v : 0)}
        min={1}
      />
      <NumberInput
        label="Desde (evento)"
        value={desde}
        onChange={(v) => setDesde(typeof v === "number" ? v : 0)}
        min={0}
      />
      <NumberInput
        label="Hasta (evento)"
        value={hasta}
        onChange={(v) => setHasta(typeof v === "number" ? v : 0)}
        min={desde + 1}
      />
      <NumberInput
        label="Cantidad de filas a mostrar"
        value={filasAMostrar}
        onChange={(v) => setFilasAMostrar(typeof v === "number" ? v : 0)}
        min={1}
        max={hasta - desde}
      />
    </Stack>
  );
}
