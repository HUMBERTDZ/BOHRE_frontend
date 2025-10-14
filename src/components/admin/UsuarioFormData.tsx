import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog";
import { useState, type FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useUsers } from "@/hooks/users/useUsers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
import { DatePicker } from "../ui/DatePicker";
import type { UsuarioFormData } from "./UsuarioForm";
import { toast } from "sonner";

interface props {
  stateDialogOpen: boolean;
  setStateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AgregarUsuario: FC<props> = ({ stateDialogOpen, setStateDialogOpen, }) => {
  // Estado local para el municipio seleccionado
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>("");

  // obteniendo funciones desde el hook que obtiene los municipios y localidades
  const { getMunicipios, getLocalidades, agregarUsuarioOptimistic } = useUsers();

  // mutación para agregar usuario
  const mutation = agregarUsuarioOptimistic();

  // desestructurando props desde el hook de municipios
  const { data: municipiosData, isFetching: municipiosIsFetching } =
    getMunicipios();

  const { register, handleSubmit, formState: { errors }, control, reset, watch, } = useForm<UsuarioFormData>({ defaultValues: { fechaNacimiento: undefined }, });

  // Observar el valor del rol seleccionado
  const rolSeleccionado = watch("rol");

  // Llamar a getLocalidades y obtener el resultado
  const { data: localidadesData, isFetching: localidadesIsFetching } = getLocalidades(municipioSeleccionado ? parseInt(municipioSeleccionado) : 0);

  /**
   * funcion para manejar el envio del formulario
   * @param data
   */
  const onSubmit = (data: UsuarioFormData) => {
    console.log(data)
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Usuario agregado exitósamente");
      },
      onError: (error) => {
        console.log(error);
        toast.error(`Error al agregar usuario... ${error.message}}`);
      },
    });
    // Aquí procesas los datos
    setStateDialogOpen(false); // Solo se cierra si la validación pasó
    reset(); // Limpia el formulario
  };

  const handleCancel = () => {
    reset();
    setMunicipioSeleccionado(""); // Limpiar también el municipio
    setStateDialogOpen(false);
  };

  return (
    <AlertDialog open={stateDialogOpen} onOpenChange={setStateDialogOpen}>
      <AlertDialogContent className="min-w-3/4 max-h-11/12 overflow-y-scroll">
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            Llene correctamente los campos para agregar el usuario
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="usersForm"
          className="space-y-4 h-fit gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Datos generales */}
          <fieldset className="space-y-2">
            <legend className="text-sm text-gray-500">Datos generales</legend>

            <div className="grid grid-cols-4 gap-2">
              {/* nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="block text-sm font-medium">
                  Nombre(s)
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Nombre(s)"
                  maxLength={20}
                  {...register("nombre", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener mínimo 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "El nombre debe tener máximo 20 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: "Solo se permiten letras",
                    },
                  })}
                />
                {errors.nombre && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.nombre.message}{" "}
                  </span>
                )}
              </div>

              {/* apellido paterno */}
              <div className="space-y-2">
                <Label
                  htmlFor="apellidoPaterno"
                  className="block text-sm font-medium"
                >
                  Apellido paterno
                </Label>
                <Input
                  id="apellidoPaterno"
                  type="text"
                  placeholder="Apellido paterno"
                  maxLength={20}
                  {...register("apellidoPaterno", {
                    required: "El apellido paterno es requerido",
                    minLength: {
                      value: 3,
                      message: "El apellido debe tener mínimo 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "El apellido debe tener máximo 20 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: "Solo se permiten letras",
                    },
                  })}
                />
                {errors.apellidoPaterno && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.apellidoPaterno.message}{" "}
                  </span>
                )}
              </div>

              {/* apellido materno */}
              <div className="space-y-2">
                <Label
                  htmlFor="apellidoMaterno"
                  className="block text-sm font-medium"
                >
                  Apellido materno
                </Label>
                <Input
                  id="apellidoMaterno"
                  type="text"
                  placeholder="Apellido materno"
                  maxLength={20}
                  {...register("apellidoMaterno", {
                    required: "El apellido materno es requerido",
                    minLength: {
                      value: 3,
                      message: "El apellido debe tener mínimo 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "El apellido debe tener máximo 20 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: "Solo se permiten letras",
                    },
                  })}
                />
                {errors.apellidoMaterno && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.apellidoMaterno.message}{" "}
                  </span>
                )}
              </div>

              {/* sexo */}
              <div className="space-y-2">
                <Label htmlFor="sexo" className="block text-sm font-medium">
                  Sexo
                </Label>
                <Controller
                  name="sexo"
                  control={control}
                  rules={{ required: "El sexo es requerido" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Hombre</SelectItem>
                        <SelectItem value="F">Mujer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.sexo && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.sexo.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* fecha de nacimiento */}
              <div>
                <Controller
                  name="fechaNacimiento"
                  control={control}
                  rules={{
                    required: "La fecha de nacimiento es requerida",
                    validate: {
                      notFuture: (value) => {
                        if (!value) return true;
                        const selectedDate =
                          typeof value === "string" ? new Date(value) : value;
                        return (
                          selectedDate <= new Date() ||
                          "La fecha no puede ser futura"
                        );
                      },
                      minAge: (value) => {
                        if (!value) return true;
                        const selectedDate =
                          typeof value === "string" ? new Date(value) : value;
                        const today = new Date();
                        const age =
                          today.getFullYear() - selectedDate.getFullYear();
                        const monthDiff =
                          today.getMonth() - selectedDate.getMonth();
                        const dayDiff =
                          today.getDate() - selectedDate.getDate();

                        // Ajustar si no ha cumplido años este año
                        const actualAge =
                          monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                            ? age - 1
                            : age;

                        return actualAge >= 12 || "Debe tener al menos 12 años";
                      },
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Fecha de Nacimiento"
                      placeholder="Seleccionar fecha"
                      value={
                        field.value
                          ? typeof field.value === "string"
                            ? new Date(field.value)
                            : field.value
                          : undefined
                      }
                      onChange={field.onChange}
                      error={errors.fechaNacimiento?.message}
                      id="fechaNacimiento"
                    />
                  )}
                />
              </div>

              {/* curp */}
              <div className="space-y-2">
                <Label htmlFor="curp" className="block text-sm font-medium">
                  CURP
                </Label>
                <Input
                  id="curp"
                  type="text"
                  placeholder="CURP"
                  maxLength={18}
                  {...register("curp", {
                    required: "El CURP es requerido",
                    minLength: {
                      value: 18,
                      message: "El curp debe tener mínimo 18 caracteres",
                    },
                    maxLength: {
                      value: 18,
                      message: "El curp debe tener máximo 18 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: "Solo se permiten letras y números",
                    },
                  })}
                />
                {errors.curp && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.curp.message}{" "}
                  </span>
                )}
              </div>

              {/* nss */}
              <div className="space-y-2">
                <Label htmlFor="nss" className="block text-sm font-medium">
                  NSS
                </Label>
                <Input
                  id="nss"
                  type="text"
                  placeholder="NSS"
                  maxLength={50}
                  {...register("nss", {
                    required: "El NSS es requerido",
                    minLength: {
                      value: 3,
                      message: "El NSS debe tener mínimo 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El NSS debe tener máximo 50 caracteres",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números",
                    },
                  })}
                />
                {errors.nss && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.nss.message}{" "}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Contacto y Cuenta */}
          <fieldset className="space-y-2">
            <legend className="text-sm text-gray-500">Contacto y Cuenta</legend>
            <div className="grid grid-cols-4 gap-2">
              {/* rol */}
              <div className="space-y-2">
                <Label htmlFor="rol" className="block text-sm font-medium">
                  Rol
                </Label>
                <Controller
                  name="rol"
                  control={control}
                  rules={{ required: "El rol es requerido" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="alumno">Alumno</SelectItem>
                        <SelectItem value="docente">Docente</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.rol && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.rol.message}
                  </span>
                )}
              </div>

              {/* telefono */}
              <div className="space-y-2">
                <Label htmlFor="telefono" className="block text-sm font-medium">
                  Telefono
                </Label>
                <Input
                  id="telefono"
                  type="text"
                  placeholder="Telefono"
                  maxLength={10}
                  {...register("telefono", {
                    required: "El teléfono es requerido",
                    minLength: {
                      value: 10,
                      message: "El teléfono debe tener mínimo 10 dígitos",
                    },
                    maxLength: {
                      value: 10,
                      message: "El teléfono debe tener máximo 10 dígitos",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números",
                    },
                  })}
                />
                {errors.telefono && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.telefono.message}{" "}
                  </span>
                )}
              </div>

              {/* correo */}
              <div className="space-y-2">
                <Label htmlFor="correo" className="block text-sm font-medium">
                  Correo
                </Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="Correo"
                  maxLength={40}
                  {...register("correo", {
                    required: "El correo es requerido",
                    minLength: {
                      value: 8,
                      message: "El correo debe tener mínimo 8 caracteres",
                    },
                    maxLength: {
                      value: 40,
                      message: "El correo debe tener máximo 40 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "El correo no es válido",
                    },
                  })}
                />
                {errors.correo && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.correo.message}{" "}
                  </span>
                )}
              </div>

              {/* contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="contrasena"
                  className="block text-sm font-medium"
                >
                  Contraseña
                </Label>
                <Input
                  id="contrasena"
                  type="password"
                  placeholder="Contraseña"
                  maxLength={12}
                  {...register("contrasena", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener mínimo 8 caracteres",
                    },
                    maxLength: {
                      value: 12,
                      message: "La contraseña debe tener máximo 12 caracteres",
                    },
                  })}
                />
                {errors.contrasena && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.contrasena.message}{" "}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Dirección */}
          <fieldset className="space-y-2">
            <legend className="text-sm text-gray-500">Dirección</legend>

            <div className="grid grid-cols-4 gap-2">
              {/* Municipio */}
              <div className="space-y-2">
                <Label
                  htmlFor="municipio"
                  className="block text-sm font-medium"
                >
                  Municipio
                </Label>
                <Select
                  onValueChange={setMunicipioSeleccionado}
                  value={municipioSeleccionado}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipiosIsFetching ? (
                      <SelectItem value="loading" disabled>
                        Cargando...
                      </SelectItem>
                    ) : (
                      municipiosData?.data.map((municipio) => (
                        <SelectItem
                          key={municipio.id}
                          value={municipio.id.toString()}
                        >
                          {municipio.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Localidad */}
              <div className="space-y-2">
                <Label
                  htmlFor="localidad"
                  className="block text-sm font-medium"
                >
                  Localidad
                </Label>
                <Controller
                  name="idLocalidad"
                  control={control}
                  rules={{ required: "La localidad es requerida" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Localidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {localidadesIsFetching ? (
                          <SelectItem value="loading" disabled>
                            Cargando...
                          </SelectItem>
                        ) : (
                          localidadesData?.data.map((localidad) => (
                            <SelectItem
                              key={localidad.id}
                              value={localidad.id.toString()}
                            >
                              {localidad.nombre}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idLocalidad && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.idLocalidad.message}
                  </span>
                )}
              </div>

              {/* numeroCasa */}
              <div className="space-y-2">
                <Label
                  htmlFor="numeroCasa"
                  className="block text-sm font-medium"
                >
                  Número de casa
                </Label>
                <Input
                  id="numeroCasa"
                  className="w-full"
                  type="number"
                  min={1}
                  placeholder="Número de casa"
                  {...register("numeroCasa", {
                    required: "El número de casa es requerido",
                    min: {
                      value: 1,
                      message: "El número de casa mínimo es 1",
                    },
                  })}
                />
                {errors.numeroCasa && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.numeroCasa.message}
                  </span>
                )}
              </div>

              {/* calle */}
              <div className="space-y-2 flex-1">
                <Label htmlFor="calle" className="block text-sm font-medium">
                  Calle
                </Label>
                <Input
                  className="w-full"
                  id="calle"
                  type="text"
                  placeholder="Calle"
                  maxLength={80}
                  {...register("calle", {
                    required: "La calle es requerida",
                    minLength: {
                      value: 5,
                      message: "La calle debe tener mínimo 5 caracteres",
                    },
                    maxLength: {
                      value: 80,
                      message: "La calle debe tener máximo 80 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/,
                      message:
                        "Solo se permiten letras y números, sin caracteres especiales",
                    },
                  })}
                />
                {errors.calle && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.calle.message}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Información extra - Condicional según rol */}
          {rolSeleccionado && rolSeleccionado !== "admin" && (
            <fieldset className="space-y-2">
              <legend className="text-sm text-gray-500">
                Información extra
              </legend>
              <div className="grid grid-cols-4 gap-2">
                {/* Campos para DOCENTE */}
                {rolSeleccionado === "docente" && (
                  <>
                    {/* cedulaProfesional */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="cedulaProfesional"
                        className="block text-sm font-medium"
                      >
                        Cédula Profesional
                      </Label>
                      <Input
                        id="cedulaProfesional"
                        className="w-full"
                        type="text"
                        placeholder="Cédula profesional"
                        maxLength={13}
                        {...register("cedulaProfesional", {
                          required:
                            rolSeleccionado === "docente"
                              ? "La cedula profesional es requerida"
                              : false,
                          minLength: {
                            value: 10,
                            message:
                              "la cédula profesional debe tener mínimo 10 dígitos",
                          },
                          maxLength: {
                            value: 13,
                            message:
                              "la cédula profesional debe tener máximo 13 dígitos",
                          },
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números",
                          },
                        })}
                      />
                      {errors.cedulaProfesional && (
                        <span className="text-xs block relative -top-1 text-red-400">
                          {errors.cedulaProfesional.message}
                        </span>
                      )}
                    </div>

                    {/* numeroExpediente */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="numeroExpediente"
                        className="block text-sm font-medium"
                      >
                        Número de expediente
                      </Label>
                      <Input
                        id="numeroExpediente"
                        className="w-full"
                        type="number"
                        min={1}
                        placeholder="Número de expediente"
                        {...register("numeroExpediente", {
                          required:
                            rolSeleccionado === "docente"
                              ? "El número de expediente es requerido"
                              : false,
                          min: {
                            value: 1,
                            message: "El número de expediente mínimo es 1",
                          },
                        })}
                      />
                      {errors.numeroExpediente && (
                        <span className="text-xs block relative -top-1 text-red-400">
                          {errors.numeroExpediente.message}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {/* Campos para ALUMNO */}
                {rolSeleccionado === "alumno" && (
                  <>
                    {/* nia */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="nia"
                        className="block text-sm font-medium"
                      >
                        NIA
                      </Label>
                      <Input
                        id="nia"
                        className="w-full"
                        type="text"
                        placeholder="NIA"
                        maxLength={8}
                        {...register("nia", {
                          required:
                            rolSeleccionado === "alumno"
                              ? "La nia es requerida"
                              : false,
                          minLength: {
                            value: 8,
                            message: "El nia debe tener mínimo 8 dígitos",
                          },
                          maxLength: {
                            value: 8,
                            message: "El nia debe tener máximo 8 dígitos",
                          },
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números",
                          },
                        })}
                      />
                      {errors.nia && (
                        <span className="text-xs block relative -top-1 text-red-400">
                          {errors.nia.message}
                        </span>
                      )}
                    </div>

                    {/* situacion */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="situacion"
                        className="block text-sm font-medium"
                      >
                        Situación
                      </Label>
                      <Controller
                        name="situacion"
                        control={control}
                        rules={{
                          required:
                            rolSeleccionado === "alumno"
                              ? "La situación es requerida"
                              : false,
                        }}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value?.toString()}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Situación" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="activo">Activo</SelectItem>
                              <SelectItem value="baja_temporal">
                                Baja temporal
                              </SelectItem>
                              <SelectItem value="baja_definitiva">
                                Baja definitiva
                              </SelectItem>
                              <SelectItem value="egresado">Egresado</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.situacion && (
                        <span className="text-xs block relative -top-1 text-red-400">
                          {errors.situacion.message}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </fieldset>
          )}
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <Button
            type="submit"
            form="usersForm"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
          >
            Aceptar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
