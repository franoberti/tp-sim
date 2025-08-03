"use client";

import { Button, Paper, Title, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/simulacion");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <Paper shadow="md" p="lg" className="max-w-3xl w-full bg-white">
        <div className="flex items-center gap-6">
          <Image
            src="/UTN_logo.jpg"
            alt="Logo UTN"
            width={100}
            height={100}
          />
          <div>
            <Title className="mb-1 text-[20px]">
              Universidad Tecnológica Nacional
            </Title>
            <Text className="text-[18px]">Facultad Regional Córdoba</Text>
            <Text className="text-[14px] font-semibold">Cátedra de Simulación</Text>
            <Text className="text-[12px] font-bold mt-1">Trabajo Práctico Final</Text>
          </div>
        </div>

        <Paper mt="xl" p="md" className="border border-gray-300 whitespace-pre-wrap text-justify text-sm">
          {`En un taller de reparaciones se garantiza poder arreglar ciertas fallas de algunos aparatos domésticos en 30 minutos. La garantía indica que si un cliente debe esperar más de 30 minutos recibe la reparación en forma gratuita. Por cada reparación se cobra un monto que oscila entre $100 y $400 uniformemente distribuido, sabiendo que el 25% del monto son repuestos.
          Los aparatos domésticos llegan con una distribución exponencial negativa, con 7 aparatos por hora en promedio. El tiempo de servicio de la reparación tiene una distribución uniforme entre 13 y 17 minutos. En el taller hay tres reparadores.

          ¿Puede funcionar con beneficios aplicando esa garantía?
          ¿Cuánto recauda en 8 horas?
          ¿Cuánto le cuesta la garantía en 8 horas?

          Simule como mínimo 100 horas.`}
        </Paper>

        <div className="mt-4">
          <Text className="font-bold text-sm">
            <strong>Alumno: Francisco Raúl Oberti</strong> 
          </Text>
          <Text className="text-sm"><strong>Legajo: 71915</strong></Text>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleClick} variant="light">
            Ir a la Simulación
          </Button>
        </div>
      </Paper>
    </main>
  );
}
