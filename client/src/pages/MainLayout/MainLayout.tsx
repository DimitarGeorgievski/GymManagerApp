import { Outlet } from "react-router-dom";
import { Header } from "../../Components/Header/Header";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
}
