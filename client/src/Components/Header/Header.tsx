import { Link } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";

export function Header() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex items-center justify-between w-full py-4 bg-white/20">
      <h1 className="font-bold text-xl pl-12">
        <Link to={"/"}>Gym Manager</Link>
      </h1>
      <ul className="flex gap-6">
        <li>
          <Link to={"/exercise"}>Exercises</Link>
        </li>
        <li>
          <Link to={"/food"}>Food</Link>
        </li>
        <li>
          <Link to={"/plan"}>Plans</Link>
        </li>
        <li>
          <Link to={"/workout"}>Workout</Link>
        </li>
      </ul>
      <p className="pr-12">Hello, {user?.firstName}</p>
    </div>
  );
}
