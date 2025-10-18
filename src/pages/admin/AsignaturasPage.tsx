import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router";

export const AsignaturasPage = () => {
  return (
    <>
      <header>
        <Breadcrumb>
          <BreadcrumbList>
            {/* inicio */}
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">Inicio</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            {/* asignaturas */}
            <BreadcrumbItem>
              <BreadcrumbLink>Asignaturas</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-bold text-center text-lg lg:text-2xl">Asignaturas</h1>
        <p className="text-gray-500">
          En este módulo puedes administrar todas las asignaturas del sistema.
        </p>
      </header>

      <main></main>
    </>
  );
};
