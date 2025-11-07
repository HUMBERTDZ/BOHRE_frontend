import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog";
import { useEffect, type FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
import { DatePicker } from "../ui/DatePicker";
import type { UsuarioFormData } from "./UsuarioFormInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { UserSemiComplete } from "@/api/users/interfaces/UserInterface";
import { usePeriods } from "@/hooks/periods/usePeriods";
import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades";
import { convertirAFormData } from "@/utils/Utils";
import { useForms } from "@/hooks/users/useForms";
import { useDireccion } from "@/hooks/direccion/useDireccion";

interface props {
  stateDialogOpen: boolean;
  setStateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  update?: {
    userToUpdate?: UserSemiComplete | null;
    handleCloseDialog?: () => void;
    handleSuccessUpdate?: () => void;
  };
}

export const UserForm: FC<props> = ({ stateDialogOpen, setStateDialogOpen, update, }) => {

  // obteniendo funciones desde el custom hooks
  const { getMunicipios, getLocalidades, } = useDireccion();
  const { getCurrentGenerations, getAllGrupoSemestres } = usePeriods();
  const { getEspecialidades } = useEspecialidades();

  // desestructurando props desde el hook de municipios
  const { data: municipiosData, isFetching: municipiosIsFetching } =
    getMunicipios();

  // useForm de react form
  const { register, handleSubmit, formState: { errors }, control, reset, watch, } = useForm<UsuarioFormData>({defaultValues: { fechaNacimiento: undefined },});

  // custom hook
  const { onSubmit, setValoresIniciales, municipioSeleccionado, setMunicipioSeleccionado } = useForms({ update, reset, setStateDialogOpen });

  // Observar el valor del rol seleccionado
  const rolSeleccionado = watch("rol");

  // obtener datas para llenar formulario
  const { data: localidadesData, isFetching: isFetchingLocalidades } = getLocalidades(municipioSeleccionado ? parseInt(municipioSeleccionado) : 1);
  const { data: generationsData, isFetching: isFetchingGenerations } = getCurrentGenerations(true);
  const { data: grupoSemestresData, isFetching: isFetchingGrupoSemestres } = getAllGrupoSemestres();
  const { data: especialidadesData, isFetching: isFetchingEspecialidades } = getEspecialidades();  

  /**
   * Función para manejar la cancelación del formulario
   */
  const handleCancel = () => {
    reset();
    setMunicipioSeleccionado("");
    update?.handleCloseDialog?.();
    setStateDialogOpen(false);
  };

  /**
   * Cargar datos del usuario cuando se va a actualizar
   */
  useEffect(() => {
    if (stateDialogOpen && update?.userToUpdate) {
      const userToUpdate = update.userToUpdate;
      const datosFormateados = convertirAFormData(userToUpdate);

      reset(datosFormateados);
      setValoresIniciales(datosFormateados);
      setMunicipioSeleccionado(userToUpdate.idMunicipio.toString());
    } else if (stateDialogOpen && !update?.userToUpdate) {
      reset({ fechaNacimiento: undefined } as any);
      setMunicipioSeleccionado("");
      setValoresIniciales(null);
    }
  }, [stateDialogOpen, update?.userToUpdate, reset]);

  /**
   * Limpiar campos condicionales cuando cambia el rol
   */
  useEffect(() => {
    if (!rolSeleccionado) return;

    // Si el rol es admin, limpiar todos los campos extra
    if (rolSeleccionado === "admin") {
      reset((formValues) => ({
        ...formValues,
        cedulaProfesional: "",
        numeroExpediente: 0,
        nia: "",
        idGeneracion: 0,
        idGrupoSemestre: 0,
        idEspecialidad: 0,
      }));
    }
    // Si el rol es docente, limpiar campos de alumno
    else if (rolSeleccionado === "docente") {
      reset((formValues) => ({
        ...formValues,
        nia: "",
        idGeneracion: 0,
        idGrupoSemestre: 0,
        idEspecialidad: 0,
      }));
    }
    // Si el rol es alumno, limpiar campos de docente
    else if (rolSeleccionado === "alumno") {
      reset((formValues) => ({
        ...formValues,
        cedulaProfesional: "",
        numeroExpediente: 0,
      }));
    }
  }, [rolSeleccionado, reset]);

  return (
    <AlertDialog open={stateDialogOpen} onOpenChange={setStateDialogOpen}>
      <AlertDialogContent className="min-w-2/5 min-h-1/2 grid grid-rows-[auto_1fr_auto] max-h-11/12">
        <AlertDialogHeader>
          <AlertDialogTitle>{ update?.userToUpdate ? "Actualizar usuario" : "Agregar usuario" }</AlertDialogTitle>
          <AlertDialogDescription>
            Llene correctamente los campos para { update?.userToUpdate ? "actualizar" : "agregar" } el usuario.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form id="usersForm" onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="generales">
            <TabsList className="w-full h-fit mb-4">
              <TabsTrigger value="generales">Datos Generales</TabsTrigger>
              <TabsTrigger value="cuenta">Contacto y Cuenta</TabsTrigger>
              <TabsTrigger value="direccion">Dirección</TabsTrigger>
              {rolSeleccionado && rolSeleccionado !== "admin" && (
                <TabsTrigger value="extra">Información Extra</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="generales" className="space-y-2">
              {/* Datos generales */}
              <fieldset className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {/* nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="block text-sm font-medium" >
                      Nombre(s)
                    </Label>
                    <Input id="nombre" type="text" placeholder="Nombre(s)" maxLength={20}
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
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.nombre && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.nombre.message}
                      </span>
                    )}
                  </div>

                  {/* apellido paterno */}
                  <div className="space-y-2">
                    <Label htmlFor="apellidoPaterno" className="block text-sm font-medium" >
                      Apellido paterno
                    </Label>
                    <Input id="apellidoPaterno" type="text" placeholder="Apellido paterno" maxLength={20}
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
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.apellidoPaterno && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.apellidoPaterno.message}
                      </span>
                    )}
                  </div>

                  {/* apellido materno */}
                  <div className="space-y-2">
                    <Label htmlFor="apellidoMaterno" className="block text-sm font-medium" >
                      Apellido materno
                    </Label>
                    <Input id="apellidoMaterno" type="text" placeholder="Apellido materno" maxLength={20}
                      {...register("apellidoMaterno", {
                        required: "El apellido materno es requerido",
                        minLength: {
                          value: 3,
                          message: "El apellido debe tener mínimo 3 caracteres",
                        },
                        maxLength: {
                          value: 20,
                          message:
                            "El apellido debe tener máximo 20 caracteres",
                        },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                          message: "Solo se permiten letras",
                        },
                      })}
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.apellidoMaterno && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.apellidoMaterno.message}
                      </span>
                    )}
                  </div>

                  {/* sexo */}
                  <div className="space-y-2">
                    <Label htmlFor="sexo" className="block text-sm font-medium">
                      Sexo
                    </Label>
                    <Controller name="sexo" control={control} rules={{ required: "El sexo es requerido" }}
                      render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value?.toString()}>
                          <SelectTrigger className="min-w-full">
                            <SelectValue placeholder="Sexo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">MASCULINO</SelectItem>
                            <SelectItem value="F">FEMENINO</SelectItem>
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

                  {/* fecha de nacimiento */}
                  <div>
                    <Controller name="fechaNacimiento" control={control}
                      rules={{
                        required: "La fecha de nacimiento es requerida",
                        validate: {
                          notFuture: (value) => {
                            if (!value) return true;
                            const selectedDate = typeof value === "string" ? new Date(value) : value;
                            return ( selectedDate <= new Date() || "La fecha no puede ser futura" );
                          },
                          minAge: (value) => {
                            if (!value) return true;
                            const selectedDate = typeof value === "string" ? new Date(value) : value;
                            const today = new Date();
                            const age = today.getFullYear() - selectedDate.getFullYear();
                            const monthDiff = today.getMonth() - selectedDate.getMonth();
                            const dayDiff = today.getDate() - selectedDate.getDate();

                            // Ajustar si no ha cumplido años este año
                            const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)  ? age - 1 : age;

                            return (
                              actualAge >= 12 || "Debe tener al menos 12 años"
                            );
                          },
                        },
                      }}
                      render={({ field }) => (
                        <DatePicker label="Fecha de Nacimiento" placeholder="Seleccionar fecha"
                          value={ field.value ? typeof field.value === "string" ? new Date(field.value) : field.value : undefined }
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
                    <Input id="curp" type="text" placeholder="CURP" maxLength={18}
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
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.curp && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.curp.message}
                      </span>
                    )}
                  </div>

                  {/* nss */}
                  <div className="space-y-2">
                    <Label htmlFor="nss" className="block text-sm font-medium">
                      NSS
                    </Label>
                    <Input id="nss" type="text" placeholder="NSS" maxLength={12}
                      {...register("nss", {
                        required: "El NSS es requerido",
                        minLength: {
                          value: 11,
                          message: "El NSS debe tener mínimo 11 caracteres",
                        },
                        maxLength: {
                          value: 12,
                          message: "El NSS debe tener máximo 12 caracteres",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9]+$/,
                          message: "Solo se permiten números y letras, sin caracteres especiales",
                        },
                      })}
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.nss && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.nss.message}
                      </span>
                    )}
                  </div>
                </div>
              </fieldset>
            </TabsContent>

            <TabsContent value="cuenta" className="space-y-2">
              {/* Contacto y Cuenta */}
              <fieldset className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {/* rol */}
                  <div className="space-y-2">
                    <Label htmlFor="rol" className="block text-sm font-medium">
                      Rol
                    </Label>
                    <Controller name="rol" control={control} rules={{ required: "El rol es requerido" }}
                      render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value?.toString()} disabled={!!update?.userToUpdate} >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">ADMINISTRADOR</SelectItem>
                            <SelectItem value="alumno">ALUMNO</SelectItem>
                            <SelectItem value="docente">DOCENTE</SelectItem>
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
                    <Label htmlFor="telefono" className="block text-sm font-medium" >
                      Telefono
                    </Label>
                    <Input id="telefono" type="text" placeholder="Telefono" maxLength={10}
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
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.telefono && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.telefono.message}
                      </span>
                    )}
                  </div>

                  {/* correo */}
                  <div className="space-y-2">
                    <Label htmlFor="correo" className="block text-sm font-medium">
                      Correo
                    </Label>
                    <Input id="correo" type="email" placeholder="Correo" maxLength={40}
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
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "El correo no es válido",
                        },
                      })}
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.correo && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.correo.message}
                      </span>
                    )}
                  </div>

                  {/* contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="contrasena" className="block text-sm font-medium">
                      Contraseña
                    </Label>
                    <Input id="contrasena" type="password" placeholder="Contraseña" maxLength={12}
                      {...register("contrasena", {
                        // No es requerido si viene userToUpdate
                        required: update?.userToUpdate ? false : "La contraseña es requerida",
                        validate: (value) => {
                          if (!value) return true; // permitir vacío cuando no es requerido
                          if (value.length < 8) return "La contraseña debe tener mínimo 8 caracteres";
                          if (value.length > 12) return "La contraseña debe tener máximo 12 caracteres";
                          return true;
                        },
                      })}
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.contrasena && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.contrasena.message}{" "}
                      </span>
                    )}
                  </div>
                </div>
              </fieldset>
            </TabsContent>

            <TabsContent value="direccion" className="space-y-2">
              <fieldset className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="municipio" className="block text-sm font-medium">
                      Municipio
                    </Label>
                    <Select onValueChange={setMunicipioSeleccionado} value={municipioSeleccionado}>
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
                    <Label htmlFor="localidad" className="block text-sm font-medium">
                      Localidad
                    </Label>
                    <Controller name="idLocalidad" control={control} rules={{ required: "La localidad es requerida" }}
                      render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(parseInt(value)) } value={field.value?.toString()} disabled={isFetchingLocalidades}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Localidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {isFetchingLocalidades ? (
                              <SelectItem value="loading" disabled>
                                Cargando...
                              </SelectItem>
                            ) : (
                              localidadesData?.data.map((localidad) => (
                                <SelectItem key={localidad.id} value={localidad.id.toString()}>
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
                    <Label htmlFor="numeroCasa" className="block text-sm font-medium">
                      Número de casa
                    </Label>
                    <Input id="numeroCasa" type="number" min={1} placeholder="Número de casa"
                      {...register("numeroCasa", {
                        required: "El número de casa es requerido",
                        min: {
                          value: 1,
                          message: "El número de casa mínimo es 1",
                        },
                      })}
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.numeroCasa && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.numeroCasa.message}
                      </span>
                    )}
                  </div>

                  {/* calle */}
                  <div className="space-y-2">
                    <Label htmlFor="calle" className="block text-sm font-medium">
                      Calle
                    </Label>
                    <Input id="calle" type="text" placeholder="Calle" maxLength={80}
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
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9#,\s]+$/,
                          message: "Solo se permiten letras, números, # y ,",
                        },
                      })}
                      className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                    />
                    {errors.calle && (
                      <span className="text-xs block relative -top-1 text-red-400">
                        {errors.calle.message}
                      </span>
                    )}
                  </div>
                </div>
              </fieldset>
            </TabsContent>

            <TabsContent value="extra" className="space-y-2">
              {/* Información extra - Condicional según rol */}
              {rolSeleccionado && rolSeleccionado !== "admin" && (
                <fieldset className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Campos para DOCENTE */}
                    {rolSeleccionado === "docente" && (
                      <>
                        {/* cedulaProfesional */}
                        <div className="space-y-2">
                          <Label htmlFor="cedulaProfesional" className="block text-sm font-medium">
                            Cédula Profesional
                          </Label>
                          <Input id="cedulaProfesional" type="text" placeholder="Cédula profesional" maxLength={13}
                            {...register("cedulaProfesional", {
                              required:
                                rolSeleccionado === "docente" ? "La cedula profesional es requerida" : false,
                              minLength: {
                                value: 10,
                                message: "la cédula profesional debe tener mínimo 10 dígitos",
                              },
                              maxLength: {
                                value: 13,
                                message: "la cédula profesional debe tener máximo 13 dígitos",
                              },
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Solo se permiten números",
                              },
                            })}
                            className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                          />
                          {errors.cedulaProfesional && (
                            <span className="text-xs block relative -top-1 text-red-400">
                              {errors.cedulaProfesional.message}
                            </span>
                          )}
                        </div>

                        {/* numeroExpediente */}
                        <div className="space-y-2">
                          <Label htmlFor="numeroExpediente" className="block text-sm font-medium">
                            Número de expediente
                          </Label>
                          <Input id="numeroExpediente" type="number" min={1} placeholder="Número de expediente"
                            {...register("numeroExpediente", {
                              required: rolSeleccionado === "docente" ? "El número de expediente es requerido" : false,
                              min: {
                                value: 1,
                                message: "El número de expediente mínimo es 1",
                              },
                            })}
                            className="uppercase placeholder:text-gray-400 placeholder:capitalize"
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
                          <Label htmlFor="nia" className="block text-sm font-medium">
                            NIA
                          </Label>
                          <Input id="nia" type="text" placeholder="NIA" maxLength={8}
                            {...register("nia", {
                              required:
                                rolSeleccionado === "alumno" ? "La nia es requerida" : false,
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
                            className="uppercase placeholder:text-gray-400 placeholder:capitalize"
                          />
                          {errors.nia && (
                            <span className="text-xs block relative -top-1 text-red-400">
                              {errors.nia.message}
                            </span>
                          )}
                        </div>

                        {/* grupo semestre */}
                        <div className="space-y-2">
                          <Label htmlFor="idGrupoSemestre" className="block text-sm font-medium">
                            Grupo Semestre
                          </Label>
                          <Controller name="idGrupoSemestre" control={control}
                            rules={{
                              required: rolSeleccionado === "alumno" ? "La generación es requerida" : false,
                            }}
                            render={({ field }) => (
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()} disabled={isFetchingGrupoSemestres}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Grupo Semestre" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isFetchingGrupoSemestres ? (
                                    <SelectItem value="loading" disabled>
                                      Cargando...
                                    </SelectItem>
                                  ) : (
                                    grupoSemestresData?.data
                                      ?.filter((grupo) => update?.userToUpdate
                                          ? grupo.id >= (update.userToUpdate.idGrupoSemestre ?? 0)
                                          : true
                                      )
                                      .map((grupo) => (
                                        <SelectItem key={grupo.id} value={grupo.id.toString()}>
                                          {grupo.numeroSemestre}° {grupo.nombreGrupo}{" "}
                                          <span className="text-gray-400">({grupo.periodoSemestre})</span>
                                        </SelectItem>
                                      ))
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.idGrupoSemestre && (
                            <span className="text-xs block relative -top-1 text-red-400">
                              {errors.idGrupoSemestre.message}
                            </span>
                          )}
                        </div>

                        {/* generación */}
                        <div className="space-y-2">
                          <Label htmlFor="idGeneracion" className="block text-sm font-medium">
                            Generación
                          </Label>
                          <Controller name="idGeneracion" control={control}
                            rules={{ required: rolSeleccionado === "alumno" ? "La generación es requerida" : false,}}
                            render={({ field }) => (
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()} 
                                disabled={
                                  isFetchingGenerations
                                  || update?.userToUpdate?.idGeneracion !== undefined
                                  && update?.userToUpdate?.idGeneracion !== null
                                }
                                >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Generación" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isFetchingGenerations ? (
                                    <SelectItem value="loading" disabled>
                                      Cargando...
                                    </SelectItem>
                                  ) : (
                                    generationsData?.data?.map((periodo) => (
                                      <SelectItem key={periodo.id} value={periodo.id.toString()}>
                                        {`${new Date(periodo.fechaIngreso).getFullYear()} - ${new Date(periodo.fechaEgreso).getFullYear()}`}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.idGeneracion && (
                            <span className="text-xs block relative -top-1 text-red-400">
                              {errors.idGeneracion.message}
                            </span>
                          )}
                        </div>

                        {/* especialidad */}
                        <div className="space-y-2">
                          <Label htmlFor="idGeneracion" className="block text-sm font-medium">
                            Especialidad
                          </Label>
                          <Controller name="idEspecialidad" control={control}
                            rules={{
                              required: false,
                            }}
                            render={({ field }) => (
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}
                                value={field.value?.toString()}
                                disabled={ 
                                  isFetchingEspecialidades 
                                  || 
                                  (
                                    update?.userToUpdate?.idEspecialidad !== undefined
                                    && 
                                    update?.userToUpdate?.idEspecialidad !== null
                                  )
                                }>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Especialidad" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isFetchingEspecialidades ? (
                                    <SelectItem value="loading" disabled>
                                      Cargando...
                                    </SelectItem>
                                  ) : (
                                    especialidadesData?.data?.map(
                                      (especialidad) => (
                                        <SelectItem key={especialidad.id} value={especialidad.id.toString()}>
                                          {especialidad.nombre}
                                        </SelectItem>
                                      )
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.idEspecialidad && (
                            <span className="text-xs block relative -top-1 text-red-400">
                              {errors.idEspecialidad.message}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </fieldset>
              )}
            </TabsContent>
          </Tabs>
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <Button type="submit" form="usersForm">
            Aceptar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
