import { Table, Pagination } from "@mantine/core";
import { useState } from "react";
import { type PasoSimulacion } from "../simulacion/tipos";
import { formatearTiempoConDias } from "@/simulacion/simulador";

interface Props {
  pasos: PasoSimulacion[];
  filasAMostrar: number;
}

export function SimulacionTable({ pasos, filasAMostrar }: Props) {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(pasos.length / filasAMostrar);

  const pasosVisibles = pasos.slice(
    (paginaActual - 1) * filasAMostrar,
    paginaActual * filasAMostrar
  );

  return (
    <div>
      <h4 className="mb-3 font-semibold text-lg text-gray-800">
        Página {paginaActual} de {totalPaginas}
      </h4>
      <div className="overflow-auto rounded-xl shadow-md border border-gray-300">
        <Table
          withColumnBorders
          withRowBorders
          highlightOnHover
          className="text-sm text-gray-800"
        >
          <thead className="bg-gray-200">
            <tr>
              <th className="text-center py-3 px-2">Reloj</th>
              <th className="text-center py-3 px-2">Evento</th>
              <th className="text-center py-3 px-2">Cliente</th>
              <th className="text-center py-3 px-2">Servidor</th>
              <th className="text-center py-3 px-2">Cola</th>
              <th className="text-center py-3 px-2">Servidores</th>
            </tr>
          </thead>
          <tbody>
            {pasosVisibles.map((p, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-blue-50 transition`}
              >
                <td className="text-center py-2 px-2">{formatearTiempoConDias(p.reloj)}</td>
                <td className="text-center py-2 px-2">{p.evento}</td>
                <td className="text-center py-2 px-2">{p.clienteId ?? "-"}</td>
                <td className="text-center py-2 px-2">{p.servidorId ?? "-"}</td>
                <td className="text-center py-2 px-2">
                  {p.cola.join(", ") || "-"}
                </td>
                <td className="text-center py-2 px-2">
                  {p.servidores
                    .map((s) => `S${s.id}:${s.ocupado ? "O" : "L"}`)
                    .join(" ")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            total={totalPaginas}
            value={paginaActual}
            onChange={setPaginaActual}
            radius="md"
            size="sm"
            color="blue"
          />
        </div>
      )}
    </div>
  );
}
