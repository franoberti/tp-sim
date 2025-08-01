"use client"
import { Button, Group, Select, NumberInput, Stack } from "@mantine/core";
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
  const [lambda, setLambda] = useState(7);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (distribucion.tipo === "Exponencial") {
      setLambda(distribucion.parametros.lambda);
    } else {
      setMin(distribucion.parametros.min);
      setMax(distribucion.parametros.max);
    }
    setTipo(distribucion.tipo);
  }, [distribucion]);

  const handleGuardar = () => {
    let nuevosParametros: Record<string, number>;
    if (tipo === "Exponencial") {
      nuevosParametros = { lambda };
    } else {
      nuevosParametros = { min, max };
    }

    onGuardar({
      ...distribucion,
      tipo,
      parametros: nuevosParametros,
    });
  };

  return (
    <Stack m="md">
      <Select
        label="Tipo de Distribución"
        value={tipo}
        onChange={(value) => setTipo(value as "Exponencial" | "Uniforme")}
        data={["Exponencial", "Uniforme"]}
      />

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

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar}>Guardar</Button>
      </Group>
    </Stack>
  );
}
