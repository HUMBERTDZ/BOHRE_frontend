import { Link } from "react-router";

export const Home = () => {
  return (
    <>
      <div>Home</div>
      <Link to="/auth">Ir a auth</Link>
    </>
  );
};
