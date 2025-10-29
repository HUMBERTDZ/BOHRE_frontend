import { Loading } from "@/components/ui/Loading";
import { useUsers } from "@/hooks/users/useUsers";
import { useParams } from "react-router";
import { UserProfile } from "./UserProfile";
import { Header } from "@/components/ui/Header";

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
      <Header
        paths={[
          { name: "usuarios", link: "/usuarios" },
          { name: "detalle usuario", link: `/usuarios/${rol}/${idPerson}` },
        ]} 
        title="Detalle usuario"
        description="Aquí puedes ver los detalles del usuario."
      />

      <main className="flex-1 overflow-hidden">
        <div className="h-full py-6">
          <UserProfile user={user!} />
        </div>
      </main>
    </div>
  );
};
