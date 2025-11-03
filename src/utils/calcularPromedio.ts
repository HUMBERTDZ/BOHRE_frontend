export const calcularPromedio = (idAlumno: number): number => {
  const calif = calificaciones[idAlumno];
  if (!calif) return 0;
  return parseFloat(
    ((calif.momento1 + calif.momento2 + calif.momento3) / 3).toFixed(2)
  );
};
