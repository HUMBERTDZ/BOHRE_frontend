import { Eye } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../button";

interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
}

interface Props {
  url: string;
  text?: string;
  className?: string;
  button?: ButtonProps;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray" | "cyan";
}

const colorClasses: Record< NonNullable<Props["color"]>, string > = {
  blue: "text-blue-500 hover:bg-blue-100 hover:text-blue-500 focus:bg-blue-100 focus:text-blue-500",
  green: "text-green-500 hover:bg-green-100 hover:text-green-500 focus:bg-green-100 focus:text-green-500",
  red: "text-red-500 hover:bg-red-100 hover:text-red-500 focus:bg-red-100 focus:text-red-500",
  yellow: "text-yellow-500 hover:bg-yellow-100 hover:text-yellow-500 focus:bg-yellow-100 focus:text-yellow-500",
  purple: "text-purple-500 hover:bg-purple-100 hover:text-purple-500 focus:bg-purple-100 focus:text-purple-500",
  gray: "text-gray-500 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500",
  cyan: "text-cyan-500 hover:bg-cyan-100 hover:text-cyan-500 focus:bg-cyan-100 focus:text-cyan-500",
};

export const ButtonLink = ({ url, text = "Ver detalles", className, button, color = "cyan"}: Props) => {
  const baseClasses = colorClasses[color] ?? colorClasses.cyan;

   const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <Link to={url} className={combinedClasses}>
      {button ? (
        <Button variant={button?.variant ?? "default"} size={button?.size ?? "default"} className="text-inherit bg-inherit hover:text-inherit hover:bg-inherit focus:bg-inherit">
          <Eye className="text-current" />
          {text}
        </Button>
      ) : (
        <>
          <Eye className="text-current" />
          {text}
        </>
      )}
    </Link>
  );
};
