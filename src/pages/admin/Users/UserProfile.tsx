import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, MapPin, Calendar, Briefcase, GraduationCap, Award as IdCard, } from "lucide-react";
import type { UserSemiComplete } from "@/api/users/interfaces/UserInterface";
import { formatDate } from "@/utils/FormatDate";

interface UserProfileProps {
  user: UserSemiComplete;
}

export function UserProfile({ user }: UserProfileProps) {
  const fullName = `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`;
  const initials = `${user.nombre.charAt(0)}${user.apellidoPaterno.charAt(0)}`;


  return (
    <ScrollArea className="h-full">
      <div className="w-full mx-auto space-y-6 pb-6">
        {/* Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl font-bold text-balance">
                    {fullName}
                  </h1>
                  <Badge variant="secondary" className="w-fit">
                    {user.rol}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    <span className="font-mono">{user.curp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>ID: {user.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Correo Electrónico
                </p>
                <p className="font-medium">{user.correo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{user.telefono}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">NSS</p>
                <p className="font-medium font-mono">{user.nss}</p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Fecha de Nacimiento
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {formatDate(user.fechaNacimiento)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="font-medium">{user.sexo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CURP</p>
                <p className="font-medium font-mono text-sm">{user.curp}</p>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Dirección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Calle y Número</p>
                <p className="font-medium">
                  {user.calle} #{user.numeroCasa}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Localidad</p>
                <p className="font-medium">{user.localidad}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Municipio</p>
                <p className="font-medium">{user.municipio}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Código Postal</p>
                <p className="font-medium">{user.codigoPostal}</p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          {user.cedulaProfesional && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Información Profesional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Cédula Profesional
                  </p>
                  <p className="font-medium font-mono">
                    {user.cedulaProfesional}
                  </p>
                </div>
                {user.numeroExpediente && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Número de Expediente
                    </p>
                    <p className="font-medium">{user.numeroExpediente}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {/* Academic Information */}
          {(user.especialidadNombre || user.numeroSemestre || user.nia) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Información Académica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
                  {user.especialidadNombre && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Especialidad
                      </p>
                      <p className="font-medium">{user.especialidadNombre}</p>
                    </div>
                  )}
                  {user.numeroSemestre && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Semestre</p>
                      <p className="font-medium">
                        {user.numeroSemestre}° Semestre
                      </p>
                    </div>
                  )}
                  {user.periodoSemestre && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Periodo</p>
                      <p className="font-medium">{user.periodoSemestre}</p>
                    </div>
                  )}
                  {user.nia && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">NIA</p>
                      <p className="font-medium font-mono">{user.nia}</p>
                    </div>
                  )}
                  {user.situacion && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Situación</p>
                      <Badge variant="outline" className={user.situacion === "ACTIVO" ? "bg-green-500 text-white" : "bg-red-500 text-white"} >{user.situacion}</Badge>
                    </div>
                  )}
                  {user.fechaIngresoGeneracion && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Fecha de Ingreso
                      </p>
                      <p className="font-medium">
                        {formatDate(user.fechaIngresoGeneracion)}
                      </p>
                    </div>
                  )}
                  {user.fechaEgresoGeneracion && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Fecha de Egreso
                      </p>
                      <p className="font-medium">
                        {formatDate(user.fechaEgresoGeneracion)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
