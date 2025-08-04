import { Table, Pagination } from "@mantine/core";
import { useState, Fragment } from "react";
import { PasoSimulacion } from "../simulacion/tipos";
import {
  formatearMinutosASegundos,
  formatearTiempoConDias,
} from "@/utils/utils";

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
              <th rowSpan={2} className="px-4 py-3 text-center">
                Reloj
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center">
                Evento
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center">
                Nro Cliente
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center">
                Próx Cliente
              </th>
              <th colSpan={3} className="text-center px-4 py-2">
                Llegada
              </th>
              {Array.from({ length: servidoresCount }).map((_, i) => (
                <th colSpan={5} key={i} className="text-center px-4 py-2">
                  Reparador {i + 1}
                </th>
              ))}
              <th colSpan={9} className="text-center px-4 py-2">
                Cliente que sale
              </th>
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
              <th className="px-4 py-2 text-center">Nro Cliente</th>
              <th className="px-4 py-2 text-center">Llegada</th>
              <th className="px-4 py-2 text-center">Salida</th>
              <th className="px-4 py-2 text-center">T. en sistema</th>
              <th className="px-4 py-2 text-center">¿Garantía?</th>
              <th className="px-4 py-2 text-center">Monto Cobrado</th>
              <th className="px-4 py-2 text-center">Ingreso neto</th>
              <th className="px-4 py-2 text-center">Ingreso Acumumulado</th>
              <th className="px-4 py-2 text-center">Gasto por garantía</th>
            </tr>
          </thead>

          <tbody>
            {pasosVisibles.map((p, idx) => {
              const c = p.clienteSalida;

              return (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="text-center px-4 py-2">
                    {formatearTiempoConDias(p.reloj)}
                  </td>
                  <td className="text-center px-4 py-2">{p.evento}</td>
                  <td className="text-center px-4 py-2">{p.cliente}</td>
                  <td className="text-center px-4 py-2">
                    {p.proximoClienteId}
                  </td>
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

                  {/* Cliente que sale */}
                  <td className="text-center px-4 py-2">{c?.id ?? "-"}</td>
                  <td className="text-center px-4 py-2">
                    {c?.llegada !== undefined
                      ? formatearTiempoConDias(c.llegada)
                      : "-"}
                  </td>
                  <td className="text-center px-4 py-2">
                    {c?.salida !== undefined
                      ? formatearTiempoConDias(c.salida)
                      : "-"}
                  </td>
                  <td className="text-center px-4 py-2">
                    {c?.tiempoSistema !== undefined
                      ? formatearMinutosASegundos(c.tiempoSistema)
                      : "-"}
                  </td>
                  <td className="text-center px-4 py-2">
                    {c?.garantia !== undefined
                      ? c.garantia
                        ? "Sí"
                        : "No"
                      : "-"}
                  </td>
                  <td className="text-center px-4 py-2">
                    {c?.monto !== undefined ? `$${c.monto}` : "-"}
                  </td>
                  <td className="text-center px-4 py-2">
                    {c?.ingresoNeto !== undefined
                      ? `$${c.ingresoNeto.toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="text-center px-4 py-2">
                    {p.ingresoAcumulado !== undefined
                      ? `$${p.ingresoAcumulado.toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="text-center px-4 py-2">
                    {p.gastoPorGarantiaAcumulado !== undefined
                      ? `$${p.gastoPorGarantiaAcumulado.toFixed(2)}`
                      : "-"}
                  </td>
                </tr>
              );
            })}
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
