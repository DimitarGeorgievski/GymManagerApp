import { Outlet } from "react-router-dom";
import { Header } from "../../Components/Header/Header";

export function MainLayout() {
  return (
    <div className="flex flec-col">
      <Header />
      <div className="flex w-full">
        <Outlet />
      </div>
    </div>
  );
}
