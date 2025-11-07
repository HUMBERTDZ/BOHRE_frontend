import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/Loading";
import { Header } from "@/components/ui/my/Header";
import { useAlumnos } from "@/hooks/alumno/useAlumnos";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { ActionOptionsMenu, } from "@/components/ui/my/ActionOptionsMenu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const AlumnoPage = () => {
  const { userCompleteData, logout } = useAuth();

  const { getAlumnoSemestres, getBoleta } = useAlumnos();
  const [downloading, setDownloading] = useState<number | null>(null);

  const { data: semestresData, isLoading } = getAlumnoSemestres(
    userCompleteData?.user.idPersona!
  );

  const handleDescargarBoleta = async (idGrupoSemestre: number) => {
    setDownloading(idGrupoSemestre);
    try {
      await getBoleta(userCompleteData?.user.idPersona!, idGrupoSemestre);
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando información del alumno..." />;
  }

  if (!semestresData?.data) {
    return (
      <div className="p-4">
        <Header
          title="Mis Boletas"
          description="No se pudo cargar la información"
          paths={[]}
          rootPath={false}
        />
        <div className="text-center text-gray-500 mt-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No se pudo cargar la información del alumno</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Header
        title={`Boletas de ${semestresData.data.alumno.nombre}`}
        description={`Bienvenid@ ${semestresData.data.alumno.nombre}, aquí puedes consultar y descargar tus boletas de calificaciones.`}
        paths={[]}
        rootPath={false}
      />

      <div className="">
        {/* Información del alumno */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Alumno</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">NIA</p>
              <p className="font-semibold text-gray-900">{semestresData.data.alumno.nia}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CURP</p>
              <p className="font-semibold text-gray-900">{semestresData.data.alumno.curp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Situación</p>
              <p className="font-semibold text-gray-900">{semestresData.data.alumno.situacion}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Especialidad</p>
              <p className="font-semibold text-gray-900">
                {semestresData.data.alumno.especialidad || 'Sin especialidad'}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de semestres */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Semestres Cursados
          </h2>

          {semestresData.data.semestres.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No hay semestres registrados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {semestresData.data.semestres.map((semestre) => (
                <div
                  key={semestre.idGrupoSemestre}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Semestre {semestre.semestre}
                        </h3>
                        {semestre.tieneCalificaciones && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Grupo: {semestre.grupo}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Periodo: {semestre.periodo}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600">
                      {semestre.totalCalificaciones}{' '}
                      {semestre.totalCalificaciones === 1 ? 'materia registrada' : 'materias registradas'}
                    </p>
                  </div>

                  {semestre.tieneCalificaciones ? (
                    <Button
                      onClick={() => handleDescargarBoleta(semestre.idGrupoSemestre)}
                      disabled={downloading === semestre.idGrupoSemestre}
                      className="w-full"
                      variant={downloading === semestre.idGrupoSemestre ? "secondary" : "default"}
                    >
                      {downloading === semestre.idGrupoSemestre ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar Boleta
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="w-full px-4 py-2 bg-yellow-50 text-yellow-700 text-sm rounded-lg text-center">
                      Sin calificaciones
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nota informativa */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Las boletas son de carácter informativo. Para documentos oficiales,
            acude a la dirección de la institución.
          </p>
        </div>
      </div>

      <div className="w-fit h-fit fixed top-4 right-4">
        <ActionOptionsMenu>
          <DropdownMenuItem className="focus:bg-red-300" onClick={() => logout()}>
            Cerrar sesión
          </DropdownMenuItem>
        </ActionOptionsMenu>
      </div>
    </div>
  );
};