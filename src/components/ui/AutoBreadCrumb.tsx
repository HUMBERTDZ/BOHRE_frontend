import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./breadcrumb";
import type { FC } from "react";
import React from "react";

interface Path {
  name: string;
  link: string;
}

interface props {
  rootPath: boolean;
  paths: Path[];
}

export const AutoBreadCrumb: FC<props> = ({ rootPath, paths }) => {
  const lastPath = paths.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {rootPath && (
          <>
            <BreadcrumbItem>
              <Link to="/inicio">Inicio</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {paths?.map((path, index) => (
          <React.Fragment key={path.link}>
            <BreadcrumbItem>
              <Link to={path.link} className="capitalize">
                {path.name}
              </Link>
            </BreadcrumbItem>
            {index !== lastPath && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
