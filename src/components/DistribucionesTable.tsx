import { Table, Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { type Distribucion } from "../simulacion/tipos";

interface Props {
  distribuciones: Distribucion[];
  onEditar: (d: Distribucion) => void;
}

export function DistribucionesTable({ distribuciones, onEditar }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-gray-300">
      <Table
        highlightOnHover
        withColumnBorders
        verticalSpacing="sm"
        className="text-sm text-gray-800"
      >
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left">Tipo</th>
            <th className="py-3 px-4 text-left">Parámetros</th>
            <th className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {distribuciones.map((dist) => (
            <tr key={dist.id} className="hover:bg-blue-50 transition">
              <td className="py-2 px-4">{dist.nombre}</td>
              <td className="py-2 px-4">{dist.tipo}</td>
              <td className="py-2 px-4">
                {Object.entries(dist.parametros)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </td>
              <td className="py-2 px-4 text-center">
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEditar(dist)}
                  color="blue"
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
