import { useState } from "react";
import { GraduationCap, BookOpen, Users, BarChart3, FileText, Shield, ChevronRight, Menu, X, CheckCircle, Award, } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const initialPath =  () => {
    switch (user?.rol) {
      case "ADMIN":
        return "/inicio";
      case "DOCENTE":
        return "/docencia";
      case "ALUMNO":
        return "/mis-clases";
      default:
        return "/auth";
    }
  }

  return (
    <ScrollArea className="w-full h-screen bg-white">
      <div className="relative">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">BOHRE</span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Características
                </button>
                <button
                  onClick={() => scrollToSection("modules")}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Módulos
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block w-full text-left py-2 text-gray-700"
                >
                  Características
                </button>
                <button
                  onClick={() => scrollToSection("modules")}
                  className="block w-full text-left py-2 text-gray-700"
                >
                  Módulos
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                  <Award className="w-4 h-4" />
                  Sistema de Control Escolar
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Gestión Escolar{" "}
                  <span className="text-blue-600">Inteligente</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  BOHRE es el sistema integral de gestión educativa diseñado
                  para bachilleratos. Optimiza la administración de
                  calificaciones, alumnos, docentes y mucho más.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={ isAuthenticated ? initialPath() : "/auth" }
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 font-semibold"
                  >
                    Comenzar
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-semibold"
                  >
                    Conocer Más
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="bg-white rounded-xl p-6 transform -rotate-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                        <div className="flex-1">
                          <div className="h-2 bg-blue-200 rounded-full w-3/4"></div>
                          <div className="h-2 bg-blue-100 rounded-full w-1/2 mt-2"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                        <div className="flex-1">
                          <div className="h-2 bg-purple-200 rounded-full w-2/3"></div>
                          <div className="h-2 bg-purple-100 rounded-full w-4/5 mt-2"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                          <div className="h-2 bg-green-200 rounded-full w-5/6"></div>
                          <div className="h-2 bg-green-100 rounded-full w-2/3 mt-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Características Principales
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Todo lo que necesitas para gestionar tu institución educativa de
                manera eficiente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-12 h-12" />,
                  title: "Gestión de Alumnos",
                  description:
                    "Control completo del registro de alumnos, grupos, semestres y especialidades.",
                  color: "blue",
                },
                {
                  icon: <BookOpen className="w-12 h-12" />,
                  title: "Control de Calificaciones",
                  description:
                    "Sistema de captura y consulta de calificaciones por momentos con cálculo automático de promedios.",
                  color: "purple",
                },
                {
                  icon: <FileText className="w-12 h-12" />,
                  title: "Boletas Digitales",
                  description:
                    "Generación automática de boletas de calificaciones en formato PDF oficial.",
                  color: "green",
                },
                {
                  icon: <BarChart3 className="w-12 h-12" />,
                  title: "Reportes y Estadísticas",
                  description:
                    "Dashboard con métricas en tiempo real sobre el desempeño académico institucional.",
                  color: "orange",
                },
                {
                  icon: <Shield className="w-12 h-12" />,
                  title: "Seguridad y Privacidad",
                  description:
                    "Control de accesos por roles con protección de datos personales y académicos.",
                  color: "indigo",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`inline-flex p-4 rounded-xl bg-${feature.color}-100 text-${feature.color}-600 mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Módulos del Sistema
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Acceso diferenciado según el rol de usuario
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  role: "Administrador",
                  color: "blue",
                  features: [
                    "Gestión completa de usuarios",
                    "Control de semestres y grupos",
                    "Administración de especialidades",
                    "Configuración del sistema",
                  ],
                },
                {
                  role: "Docente",
                  color: "purple",
                  features: [
                    "Consulta de materias asignadas",
                    "Captura de calificaciones",
                    "Exportación de listas",
                  ],
                },
                {
                  role: "Alumno",
                  color: "green",
                  features: ["Información de semestres", "Descarga de boletas"],
                },
              ].map((module, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-2xl bg-gradient-to-br from-${module.color}-50 to-white border-2 border-${module.color}-100 hover:shadow-xl transition-all`}
                >
                  <div
                    className={`inline-flex px-4 py-2 bg-${module.color}-600 text-white rounded-full text-sm font-bold mb-6`}
                  >
                    {module.role}
                  </div>
                  <ul className="space-y-3">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle
                          className={`w-5 h-5 text-${module.color}-600 flex-shrink-0 mt-0.5`}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-900 text-gray-300">
          <div className="max-w-7xl mx-auto">
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>
                © 2024 BOHRE. Sistema de Control Escolar. Todos los derechos
                reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};
