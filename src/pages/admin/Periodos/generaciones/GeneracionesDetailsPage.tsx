import { Loading } from "@/components/ui/Loading";
import { ButtonLink } from "@/components/ui/my/ButtonLink";
import { Header } from "@/components/ui/my/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePeriods } from "@/hooks/periods/usePeriods";
import { formatDate } from "@/utils/FormatDate";
import { useParams } from "react-router";

export const GeneracionesDetailsPage = () => {
  const { idGeneracion } = useParams();

  const { getGenerationsWithAlumnos } = usePeriods();

  const { data, isLoading } = getGenerationsWithAlumnos(Number(idGeneracion));

  const dataRender = data?.data || [];

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Detalles de la generación"
        description="Aquí puedes ver los alumnos pertenecientes a la generación seleccionada."
        paths={[
          { name: "periodos", link: "/periodos" },
          {
            name: "generaciones",
            link: `/periodos/generaciones/${idGeneracion}`,
          },
        ]}
      />

      <main className="flex-1 flex flex-col p-4 space-y-6 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <Table className="text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NIA</TableHead>
                <TableHead className="text-center">Nombre</TableHead>
                <TableHead className="text-center">Apellido Paterno</TableHead>
                <TableHead className="text-center">Apellido Materno</TableHead>
                <TableHead className="text-center">Fecha de Ingreso</TableHead>
                <TableHead className="text-center">Fecha de Egreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataRender.map((alumno) => (
                <TableRow key={alumno.id}>
                  <TableCell>{alumno.nia}</TableCell>
                  <TableCell>{alumno.nombre}</TableCell>
                  <TableCell>{alumno.apellidoPaterno}</TableCell>
                  <TableCell>{alumno.apellidoMaterno}</TableCell>
                  <TableCell>{formatDate(alumno.fechaIngreso)}</TableCell>
                  <TableCell>{formatDate(alumno.fechaEgreso)}</TableCell>
                  <TableCell>
                    <ButtonLink
                      text="Ver alumno"
                      url={`/usuarios/alumno/${alumno.id}`}
                      button={{
                        size: "sm",
                        variant: "outline",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </main>
    </div>
  );
};
