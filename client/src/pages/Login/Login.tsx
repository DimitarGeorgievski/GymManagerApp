import { Mail } from "lucide-react";

export function Login() {
  return (
    <div className=" min-h-screen bg-linear-to-b from-[#7f92ff] to-white flex items-center justify-center">
      <div className="w-[25%] h-[40vh] shadow-[0px_5px_20px_rgba(0,0,0,0.35)] backdrop-blur-lg rounded-3xl flex flex-col items-center gap-7 ">
        <h1 className="text-center text-2xl">Login</h1>
        <form className="flex items-center justify-center flex-col w-[20rem] h-[5rem] bg-red-500 gap-2">
          <div className="flexbg-[#F1F5F9] gap-2">
            <Mail color="#808080"/>
            <input
              className=" focus:outline-none w-full"
              type="text"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <input
              className="transparent focus:outline-none"
              type="text"
              placeholder="Enter your name"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
