import { dashBoardActions } from "@/api/dashboard/actions/dashBoardActions";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  const { fetchDashboardData } = dashBoardActions();

  const getDashboardData = () => {
    return useQuery({
      queryKey: ["dashboardData"],
      queryFn: async () => {
        const response = await fetchDashboardData();
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return { getDashboardData };
};
