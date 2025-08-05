"use client";
import {
  Box,
  Button,
  Paper,
  Stack,
  Title,
  Divider,
  Flex,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ParametrosSimulacionForm } from "./ParametrosSimulacionForm";
import { DistribucionesTable } from "./DistribucionesTable";
import { ConfigurarDistribuciones } from "./ConfigurarDistribuciones";
import { correrSimulacion } from "../simulacion/simulador";
import {
  type ParametrosSimulacionUI,
  type Distribucion,
  type ParametrosSimulacion,
  type PasoSimulacion,
} from "../simulacion/tipos";
import { useState } from "react";
import { SimulacionTable } from "./SimulacionTable";

export function PantallaSimulacion() {
  const [modalAbierto, { open, close }] = useDisclosure(false);

  const [parametrosUI, setParametrosUI] = useState<ParametrosSimulacionUI>({
    duracionHoras: 100,
    desde: 0,
    hasta: 50,
    filasAMostrar: 2,
  });

  const [pasos, setPasos] = useState<PasoSimulacion[]>([]);

  const [distribuciones, setDistribuciones] = useState<Distribucion[]>([
    {
      id: "llegadas",
      nombre: "Llegadas",
      tipo: "Exponencial",
      parametros: { lambda: 60 / 7 },
    },
    {
      id: "atencion",
      nombre: "Atención",
      tipo: "Uniforme",
      parametros: { min: 13, max: 17 },
    },
    {
      id: "cobro",
      nombre: "Cobro",
      tipo: "Uniforme",
      parametros: { min: 100, max: 400 },
    },
    {
      id: "tiempoGarantia",
      nombre: "Tiempo de Garantía",
      tipo: "Constante",
      parametros: { tiempo: 30 },
    },
  ]);

  const [resultadoSimulacion, setResultadoSimulacion] = useState<{
    totalCobrado: number;
    totalGratis: number;
  } | null>(null);

  const [editando, setEditando] = useState<Distribucion | null>(null);
  const [duracionEnMs, setDuracionEnMs] = useState<number | null>(null);
  const [duracionEnSegundos, setDuracionEnSegundos] = useState<number | null>(null);

  const handleGuardarDistribucion = (nueva: Distribucion) => {
    console.log("Guardando distribución:", nueva);
    setDistribuciones((prev) =>
      prev.map((d) => (d.id === nueva.id ? nueva : d))
    );
    close();
  };

    const handleSimular = () => {
      const distLlegadas = distribuciones.find((d) => d.id === "llegadas");
      const distAtencion = distribuciones.find((d) => d.id === "atencion");
      const distCobro = distribuciones.find((d) => d.id === "cobro");
      const distTiempoGarantia = distribuciones.find((d) => d.id === "tiempoGarantia");

      if (!distLlegadas || !distAtencion || !distTiempoGarantia || !distCobro)
        return;

      const parametros: ParametrosSimulacion = {
        lambda: distLlegadas.parametros.lambda,
        tiempoGarantia: distTiempoGarantia.parametros.tiempo,
        minAtencion: distAtencion.parametros.min,
        maxAtencion: distAtencion.parametros.max,
        montoMin: distCobro.parametros.min,
        montoMax: distCobro.parametros.max,
        duracionHoras: parametrosUI.duracionHoras,
      };

      // ⏱ Inicio del tiempo
      const inicio = performance.now();

      const resultado = correrSimulacion(parametros);

      // ⏱ Fin del tiempo
      const fin = performance.now();
      setDuracionEnMs(fin - inicio); // en milisegundos
      // setDuracionEnSegundos(duracionEnMs! / 1000);


      setResultadoSimulacion({
        totalCobrado: resultado.estadoFinal.ingresoAcumulado || 0,
        totalGratis: resultado.estadoFinal.gastoPorGarantiaAcumulado || 0,
      });
      setPasos(resultado.pasos);
    };

  return (
    <Flex gap="md" align="flex-start">
      {/* Panel izquierdo */}
      <Box w="32%">
        {/* Tabla de distribuciones */}
        <Paper shadow="sm" p="md" mb="md">
          <Title order={4} mb="sm">
            Distribuciones de Probabilidad
          </Title>
          <DistribucionesTable
            distribuciones={distribuciones}
            onEditar={(d) => {
              setEditando(d);
              open();
            }}
          />
        </Paper>

        <Divider my="sm" />

        {/* Parámetros de simulación */}
        <Paper shadow="sm" p="md">
          <Title order={4} mb="sm">
            Parámetros de Simulación
          </Title>
          <ParametrosSimulacionForm onChange={setParametrosUI} />
        </Paper>

        <Stack mt="lg">
          <Button fullWidth color="blue" onClick={handleSimular}>
            Iniciar Simulación
          </Button>
        </Stack>
        {resultadoSimulacion && (
          <Stack>
            <h3 className="text-lg font-semibold">Resultados Finales</h3>
            <p>✔️ Ingreso total: ${resultadoSimulacion.totalCobrado?.toFixed(2)}</p>
            <p>
              💸 Gasto por garantía: $
              {resultadoSimulacion.totalGratis?.toFixed(2)}
            </p>
            <p>
              {resultadoSimulacion.totalCobrado > 0
                ? "✅ El sistema funciona con beneficios."
                : "❌ El sistema no es rentable con la garantía actual."}
            </p>
            <p>
              ⏱ Duración de la simulación:{" "}
              {duracionEnMs !== null ? `${duracionEnMs.toFixed(2)} ms` : "N/A"}
              {/* {duracionEnSegundos} segundos */}

            </p>
          </Stack>
        )}
      </Box>

      {/* Panel derecho (resultados) */}
      <Box w="68%">
        <Paper shadow="sm" p="md" h="100%">
          <Title order={4}>Resultados de la Simulación</Title>
          <Divider my="sm" />
          {pasos.length > 0 && (
            <SimulacionTable
              pasos={pasos}
              filasAMostrar={parametrosUI.filasAMostrar}
            />
          )}
          {pasos.length == 0 && (
            <p className="text-gray-600">
              Ejecutá una simulación para ver resultados.
            </p>
          )}
        </Paper>
      </Box>

      {/* Modal de configuración de distribuciones */}
      <Modal
        opened={modalAbierto}
        onClose={close}
        title="Configuración de Distribuciones"
        size="lg"
        centered
      >
        {editando && (
          <ConfigurarDistribuciones
            distribucion={editando}
            onGuardar={handleGuardarDistribucion}
            onClose={close}
          />
        )}
      </Modal>
    </Flex>
  );
}
