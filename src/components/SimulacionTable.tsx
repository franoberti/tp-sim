import { Table, Pagination } from "@mantine/core";
import { useState, Fragment } from "react";
import { type EstadoSimulacion } from "../simulacion/tipos";
import { formatearMinutosASegundos, formatearTiempoConDias } from "@/utils/utils";

interface Props {
  pasos: EstadoSimulacion[];
  filasAMostrar: number;
}

export function SimulacionTable({ pasos, filasAMostrar }: Props) {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(pasos.length / filasAMostrar);
  const pasosVisibles = pasos.slice(
    (paginaActual - 1) * filasAMostrar,
    paginaActual * filasAMostrar
  );

  const servidoresCount = pasos[0]?.servidores.length || 0;

  return (
    <div>
      <h4 className="mb-3 font-semibold text-lg text-gray-800">
        Página {paginaActual} de {totalPaginas}
      </h4>

      <div className="overflow-auto rounded-xl shadow-md border border-gray-300">
        <Table withColumnBorders withRowBorders highlightOnHover>
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th rowSpan={2} className="px-4 py-3 text-center">Reloj</th>
              <th rowSpan={2} className="px-4 py-3 text-center">Evento</th>
              <th rowSpan={2} className="px-4 py-3 text-center">Nro Cliente</th>
              <th rowSpan={2} className="px-4 py-3 text-center">Próx Cliente</th>
              <th colSpan={3} className="text-center px-4 py-2">Llegada</th>
              {Array.from({ length: servidoresCount }).map((_, i) => (
                <th colSpan={5} key={i} className="text-center px-4 py-2">
                  Reparador {i + 1}
                </th>
              ))}
            </tr>
            <tr className="text-sm">
              <th className="px-4 py-2 text-center">T. entre llegadas</th>
              <th className="px-4 py-2 text-center">Próx llegada</th>
              <th className="px-4 py-2 text-center">Servidor asignado</th>
              {Array.from({ length: servidoresCount }).map((_, i) => (
                <Fragment key={i}>
                  <th className="px-4 py-2 text-center">Estado</th>
                  <th className="px-4 py-2 text-center">Cliente</th>
                  <th className="px-4 py-2 text-center">T. atención</th>
                  <th className="px-4 py-2 text-center">Próx fin atención</th>
                  <th className="px-4 py-2 text-center">Cola</th>
                </Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {pasosVisibles.map((p, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="text-center px-4 py-2">
                  {formatearTiempoConDias(p.reloj)}
                </td>
                <td className="text-center px-4 py-2">{p.evento}</td>
                <td className="text-center px-4 py-2">{p.cliente}</td>
                <td className="text-center px-4 py-2">{p.proximoClienteId}</td>
                <td className="text-center px-4 py-2">
                  {typeof p.llegada.tiempoEntreLlegadas === "number"
                    ? formatearMinutosASegundos(p.llegada.tiempoEntreLlegadas)
                    : "-"}
                </td>
                <td className="text-center px-4 py-2">
                  {typeof p.llegada.proximaLlegada === "number"
                    ? formatearTiempoConDias(p.llegada.proximaLlegada)
                    : "-"}
                </td>
                <td className="text-center px-4 py-2">
                  {p.llegada.servidorAsignado}
                </td>

                {p.servidores.map((s) => (
                  <Fragment key={s.id}>
                    <td className="text-center px-4 py-2">{s.estado}</td>
                    <td className="text-center px-4 py-2">
                      {s.clienteActual ?? "-"}
                    </td>
                    <td className="text-center px-4 py-2">
                      {typeof s.tiempoAtencion === "number"
                        ? formatearMinutosASegundos(s.tiempoAtencion)
                        : "-"}
                    </td>
                    <td className="text-center px-4 py-2">
                      {typeof s.ProximoFinAtencion === "number"
                        ? formatearTiempoConDias(s.ProximoFinAtencion)
                        : "-"}
                    </td>
                    <td className="text-center px-4 py-2">
                      {s.cola.length > 0 ? s.cola.join("_") : "-"}
                    </td>
                  </Fragment>
                ))}
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
