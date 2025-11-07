import { BaseAPI } from "@/api/BaseAPI";
import type { ResponseError } from "@/api/GeneralErrorInterface";
import axios from "axios";
import { toast } from "sonner";
import type { DashboardResponse } from "../interfaces/dashboardInterfaces";

export const dashBoardActions = () => {
  const baseAPI = BaseAPI({ prefix: "dashboard" });

  const fetchDashboardData = async (): Promise<DashboardResponse> => {
    try {
      const response = await baseAPI.get<DashboardResponse>("/estadisticas");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }

      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  return {
    fetchDashboardData,
  };
};
