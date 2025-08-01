"use client"
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
      parametros: { lambda: 7 },
    },
    {
      id: "atencion",
      nombre: "Atención",
      tipo: "Uniforme",
      parametros: { min: 13, max: 17 },
    },
  ]);

  const [resultadoSimulacion, setResultadoSimulacion] = useState<{
    totalCobrado: number;
    totalGratis: number;
  } | null>(null);

  const [editando, setEditando] = useState<Distribucion | null>(null);

  const handleGuardarDistribucion = (nueva: Distribucion) => {
    setDistribuciones((prev) =>
      prev.map((d) => (d.id === nueva.id ? nueva : d))
    );
    close();
  };

  const handleSimular = () => {
    const distLlegadas = distribuciones.find((d) => d.id === "llegadas");
    const distAtencion = distribuciones.find((d) => d.id === "atencion");

    if (!distLlegadas || !distAtencion) return;

    const parametros: ParametrosSimulacion = {
      lambda: distLlegadas.parametros.lambda,
      tiempoGarantia: 30, // si querés luego lo hacés configurable
      minAtencion: distAtencion.parametros.min,
      maxAtencion: distAtencion.parametros.max,
      montoMin: 100,
      montoMax: 400,
      duracionHoras: parametrosUI.duracionHoras,
    };

    const resultado = correrSimulacion(parametros);
    console.log("Resultado simulación:", resultado);
    setResultadoSimulacion({
      totalCobrado: resultado.totalCobrado,
      totalGratis: resultado.totalGratis,
    });
    setPasos(resultado.pasos);
  };

  return (
    <Flex gap="md" align="flex-start" m="md" p="md">
      {/* Panel izquierdo */}
      <Box w="30%">
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
      </Box>

      {/* Panel derecho (resultados) */}
      <Box w="69%">
        <Paper shadow="sm" p="md" h="100%">
          <Title order={4}>Resultados de la Simulación</Title>
          <Divider my="sm" />
          {pasos.length > 0 && (
            <SimulacionTable
              pasos={pasos}
              filasAMostrar={parametrosUI.filasAMostrar}
            />
          )}
          {resultadoSimulacion ? (
            <Stack>
              <Title order={5}>Resultados</Title>
              <p>
                <strong>Total recaudado:</strong> $
                {resultadoSimulacion.totalCobrado}
              </p>
              <p>
                <strong>Total gratis (garantía):</strong> $
                {resultadoSimulacion.totalGratis}
              </p>
              <p>
                <strong>Beneficio neto:</strong> $
                {resultadoSimulacion.totalCobrado -
                  resultadoSimulacion.totalGratis}
              </p>
            </Stack>
          ) : (
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
