import { dashBoardActions } from "@/api/dashboard/actions/dashBoardActions";
import type { DashboardResponse } from "@/api/dashboard/interfaces/dashboardInterfaces";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useDashboard = () => {
  const { fetchDashboardData } = dashBoardActions();

  const getDashboardData = (): UseQueryResult<DashboardResponse, Error> => {
    return useQuery({
      queryKey: ["dashboardData"],
      queryFn: fetchDashboardData,
      staleTime: 5 * 60 * 1000,
    });
  };

  return { getDashboardData };
};
