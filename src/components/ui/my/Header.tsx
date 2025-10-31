import type { FC } from "react";
import { AutoBreadCrumb } from "./AutoBreadCrumb";

interface Path {
  name: string;
  link: string;
}

interface props {
  rootPath?: boolean;
  paths: Path[];
  title: string;
  description: string;
}

export const Header: FC<props> = ({ rootPath = true, paths, title, description }) => {
  return (
    <header>
      <AutoBreadCrumb rootPath={rootPath}  paths={paths} />
      <div className="mb-4">
        <h1 className="font-bold text-center text-lg lg:text-2xl">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </header>
  );
};
