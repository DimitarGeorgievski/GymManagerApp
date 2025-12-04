import { Outlet } from "react-router-dom";
import { Header } from "../../Components/Header/Header";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white flex flex-col text-xl">
      <Header />
      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
}
