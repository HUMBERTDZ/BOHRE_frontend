import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loading } from "@/components/ui/Loading";
import { useUsers } from "@/hooks/users/useUsers";
import { Link, useParams } from "react-router";
import { UserProfile } from "./UserProfile";

export const UserDetailsPage = () => {
  const { rol, idPerson } = useParams();
  console.log(rol, idPerson);

  const { getSemicompleteUserData } = useUsers();

  const { data, isFetching } = getSemicompleteUserData(
    rol!,
    Number(idPerson),
    rol !== undefined
  );

  if (!data) {
    return <Loading message="Cargando información del usuario" />;
  }

  const user = data.data;

  if (isFetching) {
    return <Loading message="Cargando información del usuario" />;
  }

  if (!user) {
    console.log(user);
    return <div>No se encontró el usuario.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
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
            {/* usuarios */}
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/usuarios">Usuarios</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            {/* usuarios */}
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to={`/usuarios/${rol}/${idPerson}`}>Detalle usuario</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold text-center text-lg lg:text-2xl">
          Detalle usuario
        </h1>
        <p className="text-gray-500">
          Aquí puedes ver los detalles del usuario.
        </p>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full py-6">
          <UserProfile user={user!} />
        </div>
      </main>
    </div>
  );
};
