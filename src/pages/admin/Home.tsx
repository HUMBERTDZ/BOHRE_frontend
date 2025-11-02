import { Header } from "../../components/ui/my/Header";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import { useDashboard } from "../../hooks/dashboard/useDashboard";

export const Home = () => {
  const { getDashboardData } = useDashboard();

  const { data, isLoading } = getDashboardData();

  if (isLoading) {
    return (
      <>
        <Header
          title="Inicio - BOHRE"
          description="Bienvenido a BOHRE, a continuación podrás ver información relevante del sistema."
          paths={[]}
        />
        <main className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header
          title="Inicio - BOHRE"
          description="Bienvenido a BOHRE, a continuación podrás ver información relevante del sistema."
          paths={[]}
        />
        <main className="p-6">
          <div className="text-center text-gray-500">
            No se pudieron cargar las estadísticas
          </div>
        </main>
      </>
    );
  }

  const COLORS = [
    "#4472C4",
    "#ED7D31",
    "#A5A5A5",
    "#FFC000",
    "#5B9BD5",
    "#70AD47",
  ];

  return (
    <>
      <Header
        title="Inicio - BOHRE"
        description="Bienvenido a BOHRE, a continuación podrás ver información relevante del sistema."
        paths={[]}
      />
      <main className="h-[calc(100vh-80px)] overflow-hidden">
        <div className="h-full overflow-y-auto p-6 bg-gray-50">
          {/* Tarjetas de estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Alumnos
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.general.totalAlumnos}
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    {data.general.alumnosActivos} activos
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Egresados</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.general.alumnosEgresados}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Histórico</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Docentes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.general.totalDocentes}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Personal académico
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Promedio General
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.general.promedioGeneral}
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    {data.general.clasesActivas} clases activas
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Semestres activos */}
          {data.general.semestresActivos.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 font-medium">
                📅 Semestres activos: {data.general.semestresActivos.join(", ")}
              </p>
            </div>
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alumnos por Semestre */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alumnos por Semestre
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.graficos.alumnosPorSemestre}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semestre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#4472C4" name="Alumnos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Alumnos por Especialidad */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alumnos por Especialidad
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.graficos.alumnosPorEspecialidad}
                    dataKey="total"
                    nameKey="especialidad"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.graficos.alumnosPorEspecialidad.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Alumnos por Sexo */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Alumnos por Sexo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.graficos.alumnosPorSexo}
                    dataKey="total"
                    nameKey="sexo"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.graficos.alumnosPorSexo.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.sexo === "Masculino" ? "#4472C4" : "#ED7D31"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Docentes por Sexo */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Docentes por Sexo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.graficos.docentesPorSexo}
                    dataKey="total"
                    nameKey="sexo"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.graficos.docentesPorSexo.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.sexo === "Masculino" ? "#5B9BD5" : "#FFC000"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top 10 Grupos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top 10 Grupos con más alumnos
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.graficos.alumnosPorGrupo}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="grupo" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#ED7D31" name="Alumnos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribución de Calificaciones */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Calificaciones
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.graficos.distribucionCalificaciones}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rango" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#70AD47" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
