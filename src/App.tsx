import { Router } from "./router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: true, // Cambiado a true para refetch al enfocar la ventana
        refetchOnReconnect: true, // Cambiado a true para refetch al reconectar la red
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
