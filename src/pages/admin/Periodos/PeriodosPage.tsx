import { Header } from "@/components/ui/my/Header";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { GeneracionesTab } from "./generaciones/GeneracionesTab";
import { SemestresTab } from "./semestres/SemestresTab";

export const PeriodosPage = () => {
  return (
    <>
      <Header
        title="Periodos"
        description="Administrar periodos"
        paths={[{ name: "periodos", link: "/periodos" }]}
      />
      <Tabs defaultValue={"generaciones"}>
        <TabsList>
          <TabsTrigger value="generaciones">Generaciones</TabsTrigger>
          <TabsTrigger value="semestres">Semestres</TabsTrigger>
        </TabsList>
        <TabsContent value="generaciones">
          <GeneracionesTab />
        </TabsContent>
        <TabsContent value="semestres">
          <SemestresTab />
        </TabsContent>
      </Tabs>
    </>
  );
};
