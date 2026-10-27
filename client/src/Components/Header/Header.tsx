import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";

export function Header() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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
      <div className="flex pr-12">
        <p className="pr-6">Hello, {user?.firstName}</p>
        <button type="button" onClick={handleLogout} className="cursor-pointer">
          Log out
        </button>
      </div>
    </div>
  );
}
