import axios from "axios";

// crea una instancia de axios con la ruta comun entre todas
// la ruta base esta en .env
export const UsersAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/usuarios`,
});
