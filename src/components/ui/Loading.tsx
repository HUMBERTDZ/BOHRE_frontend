import type { FC } from "react";
import { Button } from "./button";
import { Spinner } from "./spinner";

export const Loading: FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="w-full h-full grid place-content-center gap-4">
      <Button variant="secondary" disabled size="sm">
        <Spinner />
        {message || "Cargando..."}
      </Button>
    </div>
  );
};
