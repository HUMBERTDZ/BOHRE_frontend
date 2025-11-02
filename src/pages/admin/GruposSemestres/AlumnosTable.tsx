import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Alumno } from "@/api/gruposSemestres/interfaces/gruposSemestresExtraInterface";
import { ButtonLink } from "@/components/ui/my/ButtonLink";
import { useMemo, useState } from "react";
import { AsignarEspecialidad } from "./AsignarEspecialidad";
import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades";
import { AlertDialogActions } from "@/components/users/AlertDialogActions";
import { useUsers } from "@/hooks/users/useUsers";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AlumnosTableProps {
  alumnos: Alumno[];
  semestreNumero?: number;
}

export function AlumnosTable({ alumnos, semestreNumero = 0 }: AlumnosTableProps) {
  const alumnosOrdenados = useMemo(() => {
    return [...alumnos].sort((a, b) => {
      // Comparar por apellido paterno
      const comparacionPaterno = (a.apellidoPaterno || '').localeCompare(
        b.apellidoPaterno || '',
        'es',
        { sensitivity: 'base' }
      );
      
      if (comparacionPaterno !== 0) {
        return comparacionPaterno;
      }

      // Si son iguales, comparar por apellido materno
      const comparacionMaterno = (a.apellidoMaterno || '').localeCompare(
        b.apellidoMaterno || '',
        'es',
        { sensitivity: 'base' }
      );
      
      if (comparacionMaterno !== 0) {
        return comparacionMaterno;
      }

      // Si son iguales, comparar por nombre
      return (a.nombre || '').localeCompare(
        b.nombre || '',
        'es',
        { sensitivity: 'base' }
      );
    });
  }, [alumnos]);

  const { getEspecialidades } = useEspecialidades();
  const { asignarEspecialidadAlumno } = useUsers();
  const queryClient = useQueryClient();

  const { data: especialidades } = getEspecialidades();

  const [data, setData] = useState<{especialidad: {id: number; nombre: string}, alumno: Alumno} | null>(null);

  const handleAsignarEspecialidad = () => {
    if (!data) return;
    
      asignarEspecialidadAlumno.mutate({ 
        idAlumno: data.alumno.id, 
        idEspecialidad: data.especialidad ? data.especialidad.id : null
      }, {
        onSuccess: () => {
          toast.success(`Especialidad ${data.especialidad.nombre} asignada a ${data.alumno.nombre} ${data.alumno.apellidoPaterno}.`);
          // Invalidar queries relacionadas
          queryClient.invalidateQueries({ queryKey: ["grupoSemestreExtra"] });
        },
        onError: (error) => {
          toast.error(`Error al asignar especialidad: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        },
        onSettled: () => {
          setData(null);
        }
      });
  };
  

  return (
    <>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Alumnos del semestre y grupo
          </CardTitle>
        </CardHeader>
        <div className="p-2">
          <div className="overflow-x-auto">
            <Table className="text-center">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold text-center">NIA</TableHead>
                  <TableHead className="font-semibold text-center">
                    Apellido Paterno
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Apellido Materno
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Nombre
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Especialidad
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnosOrdenados.length === 0 || !alumnosOrdenados[0].id ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No hay alumnos registrados en este grupo
                    </TableCell>
                  </TableRow>
                ) : (
                  alumnosOrdenados.map((alumno) => {
                    if (alumno.id === undefined) return null;

                    return (
                      <TableRow
                        key={alumno.id}
                        className="border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm">
                          {alumno.nia}
                        </TableCell>
                        <TableCell>{alumno.apellidoPaterno}</TableCell>
                        <TableCell>{alumno.apellidoMaterno}</TableCell>
                        <TableCell className="font-medium">
                          {alumno.nombre}
                        </TableCell>
                        <TableCell>
                          {
                            alumno.especialidad 
                            ? alumno.especialidad 
                            : ( semestreNumero === 3 
                                ? <AsignarEspecialidad
                                    especialidades={especialidades?.data || []}
                                    onOpen={(especialidad: {id: number; nombre: string}) => {
                                      setData({ especialidad, alumno });
                                    }}
                                 />
                                : <h1>No disponible</h1>
                              )
                            
                          }
                        </TableCell>
                        <TableCell>
                            <ButtonLink url={`/usuarios/alumno/${alumno.personaId}`} text="Ver perfil" button={{ variant: "outline", size: "sm" }} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
      <AlertDialogActions
          title={`Asignar alumno a especialidad ${data?.especialidad?.nombre}`}
          description={`${data?.alumno?.apellidoPaterno} ${data?.alumno?.apellidoMaterno} ${data?.alumno?.nombre}. ¿Estás seguro de que deseas asignar esta especialidad al alumno?`}
          danger="Esta acción no se puede deshacer."
          onConfirm={handleAsignarEspecialidad}
          open={!!data}
          onOpenChange={() => setData(null)}
        />
    </>
  );
}
