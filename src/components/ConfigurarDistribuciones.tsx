"use client"
import { Button, Group, NumberInput, Stack } from "@mantine/core";
import { useState, useEffect } from "react";
import { type Distribucion } from "../simulacion/tipos";

interface Props {
  distribucion: Distribucion;
  onGuardar: (d: Distribucion) => void;
  onClose: () => void;
}

export function ConfigurarDistribuciones({
  distribucion,
  onGuardar,
  onClose,
}: Props) {
  const [tipo, setTipo] = useState(distribucion.tipo);
  const [lambda, setLambda] = useState(60/7);
  const [min, setMin] = useState(13);
  const [max, setMax] = useState(17);
  const [tiempoGarantia, setTiempoGarantia] = useState(30);

  useEffect(() => {
    if (distribucion.tipo === "Exponencial") {
      setLambda(distribucion.parametros.lambda);
    } else if (distribucion.tipo === "Uniforme") 
       {
      setMin(distribucion.parametros.min);
      setMax(distribucion.parametros.max);
    }
    else {
      setTiempoGarantia(distribucion.parametros.tiempo);
    }
    setTipo(distribucion.tipo);
  }, [distribucion]);

  const handleGuardar = () => {
    let nuevosParametros: Record<string, number>;
    if (tipo == "Exponencial") {
      
      nuevosParametros = { lambda };
    } else if (tipo === "Uniforme") {
      nuevosParametros = { min, max };
    }
    else {
      nuevosParametros = { tiempo: tiempoGarantia };
    }

    onGuardar({
      ...distribucion,
      tipo,
      parametros: nuevosParametros,
    });
  };

  return (
    <Stack m="md">

      {tipo === "Exponencial" && (
        <NumberInput
          label="λ (Lambda - aparatos por hora)"
          value={lambda}
          onChange={(v) => typeof v === "number" && setLambda(v)}
          min={0.1}
          step={0.1}
        />
      )}

      {tipo === "Uniforme" && (
        <>
          <NumberInput
            label="Mínimo"
            value={min}
            onChange={(v) => typeof v === "number" && setMin(v)}
          />
          <NumberInput
            label="Máximo"
            value={max}
            onChange={(v) => typeof v === "number" && setMax(v)}
          />
        </>
      )}
      
      {tipo === "Constante" && (
        <>
          <NumberInput
            label="Tiempo de Garantia (minutos)"
            value={tiempoGarantia}
            onChange={(v) => typeof v === "number" && setTiempoGarantia(v)}
          />
        </>
      )}

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar}>Guardar</Button>
      </Group>
    </Stack>
  );
}
