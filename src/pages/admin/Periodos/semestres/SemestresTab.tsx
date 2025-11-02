import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeriods } from "@/hooks/periods/usePeriods";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

type SemestreForm = {
  mesInicio: number;
  diaInicio: number;
  mesFin: number;
  diaFin: number;
  semestres: number;
};

export const SemestresTab = () => {
  const [stateDialogOpen, setStateDialogOpen] = useState(false);

  const { getSemestresRaw, getUpdatePeriodsSemestres } = usePeriods();
  const { data, isLoading } = getSemestresRaw();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SemestreForm>({
    defaultValues: {
      mesInicio: 0,
      diaInicio: 0,
      mesFin: 0,
      diaFin: 0,
      semestres: 0,
    },
  });

  const onSubmit = (data: SemestreForm) => {
    getUpdatePeriodsSemestres.mutate(data, {
      onSuccess: (response) => {
        console.log(response);
        queryClient.invalidateQueries({ queryKey: ["semestresRaw"] });
        queryClient.invalidateQueries({ queryKey: ["grupoSemestres"] });
      },
    });

    reset();
    setStateDialogOpen(false);
  };

  const mesInicio = Number(watch("mesInicio"));
  const diaInicio = Number(watch("diaInicio"));
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  if (isLoading) return <Loading />;

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <CardTitle>Semestres</CardTitle>
          <CardDescription>
            Aquí puedes ver los semestres y las fechas correspondientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="absolute top-4 right-4"
            variant="outline"
            size="sm"
            onClick={() => setStateDialogOpen(true)}
          >
            Alterar periodos
          </Button>

          <Table className="text-center">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold text-center">
                  Número de Semestre
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Periodo inicio
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Periodo fin
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((semestre) => (
                <TableRow
                  key={semestre.id}
                  className="hover:bg-muted/50 border-border/50"
                >
                  <TableCell>{semestre.numero}</TableCell>
                  <TableCell>
                    {semestre.diaInicio}/{semestre.mesInicio}
                  </TableCell>
                  <TableCell>
                    {semestre.diaFin}/{semestre.mesFin}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <AlertDialog open={stateDialogOpen} onOpenChange={setStateDialogOpen}>
        <AlertDialogContent className="min-w-[500px] grid grid-rows-[auto_1fr_auto] max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>Establecer fechas por semestre</AlertDialogTitle>
            <AlertDialogDescription>
              Selecciona las fechas y el tipo de semestre.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* TIPO DE SEMESTRE */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Tipo de semestre
                </label>
                <Controller
                  name="semestres"
                  control={control}
                  rules={{ required: "Selecciona un tipo de semestre" }}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          Semestres impares{" "}
                          <span className="text-gray-300">(1, 2 y 3)</span>
                        </SelectItem>
                        <SelectItem value="2">
                          Semestres pares{" "}
                          <span className="text-gray-300">(4, 5 y 6)</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.semestres && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.semestres.message}
                  </p>
                )}
              </div>

              {/* MES INICIO */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mes inicio
                </label>
                <Controller
                  name="mesInicio"
                  control={control}
                  rules={{ required: "El mes de inicio es requerido" }}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {meses.map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.mesInicio && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.mesInicio.message}
                  </p>
                )}
              </div>

              {/* DÍA INICIO */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Día inicio
                </label>
                <Controller
                  name="diaInicio"
                  control={control}
                  rules={{ required: "El día de inicio es requerido" }}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona día" />
                      </SelectTrigger>
                      <SelectContent>
                        {dias.map((d) => (
                          <SelectItem key={d} value={String(d)}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.diaInicio && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.diaInicio.message}
                  </p>
                )}
              </div>

              {/* MES FIN */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mes fin
                </label>
                <Controller
                  name="mesFin"
                  control={control}
                  rules={{
                    required: "El mes de fin es requerido",
                  }}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {meses.map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.mesFin && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.mesFin.message}
                  </p>
                )}
              </div>

              {/* DÍA FIN */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Día fin
                </label>
                <Controller
                  name="diaFin"
                  control={control}
                  rules={{
                    required: "El día de fin es requerido",
                    validate: (v) => {
                      const mesFin = Number(watch("mesFin"));
                      if (
                        mesInicio === mesFin &&
                        diaInicio &&
                        Number(v) <= diaInicio
                      ) {
                        return "El día fin debe ser posterior al día inicio";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona día" />
                      </SelectTrigger>
                      <SelectContent>
                        {dias.map((d) => (
                          <SelectItem key={d} value={String(d)}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.diaFin && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.diaFin.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStateDialogOpen(false);
                  reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
