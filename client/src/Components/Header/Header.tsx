import { useUserStore } from "../../store/useUser";

export function Header() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex space-between">
      <h1>Gym Manager</h1>
      <ul>
        <li>
          <a>Exercises</a>
        </li>
        <li>
          <a>Food</a>
        </li>
        <li>
          <a>Plans</a>
        </li>
        <li>
          <a>Workout</a>
        </li>
      </ul>
      Hello, {user?.firstName}
    </div>
  );
}
