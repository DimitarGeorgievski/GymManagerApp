import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import type { loginUserReq } from "../../models/user.model";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { tokenService } from "../../services/tokenService";
import { useUserStore } from "../../store/useUser";

export function Login() {
  const navigate = useNavigate();
  const onRegister = () => {
    navigate("/register");
  };
  document.title = "Login";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginUserReq>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
    mode: "onBlur",
  });
  const setUser = useUserStore((state) => state.setUser)
  const onSubmit = async (data: loginUserReq) => {
    try {
      const response = await api.post("/auth/login", data);
      console.log(response);
      const { accessToken, refreshToken, user } = response.data;
      navigate("/");
      console.log("access", tokenService.getAccessToken())
      console.log("refresh", tokenService.getRefreshToken())
      tokenService.setTokens(accessToken, refreshToken);
      setUser(user)
      toast.success("Successfully logged in");
      return user;
    } catch (error) {
      toast.error("There was a error logging, try again");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white flex items-center justify-center">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        closeOnClick
        draggable
        style={{ zIndex: 9999 }}
      />
      <div className="md:w-[45%] lg:w-[35%] xl:w-[25%] w-[55%] h-[40vh]  shadow-[0px_5px_20px_rgba(0,0,0,0.35)] backdrop-blur-lg rounded-3xl flex flex-col items-center gap-7 ">
        <h1 className="text-center text-2xl pt-8">Login</h1>
        <form
          onSubmit={handleSubmit(async (data) => {
            const user = await onSubmit(data);
            if (user) reset();
          })}
          className="flex items-center justify-center flex-col pt-30 w-[70%] h-20 gap-4"
        >
          <div
            className={`flex w-[90%] p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
              errors.email ? "border-2 border-red-500" : ""
            }`}
          >
            <Mail
              color="#808080"
              className="w-6 h-6"
              size={24}
              width={24}
              height={24}
            />
            <input
              className=" focus:outline-none w-full"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />
          </div>
          {errors.email && (
            <div className="w-[90%] text-left text-red-500">
              Enter your email
            </div>
          )}
          <div
            className={`flex w-[90%] p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
              errors.password ? "border-2 border-red-500" : ""
            }`}
          >
            <Lock color="#808080" />
            <input
              className="focus:outline-none w-full"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true, maxLength: 50 })}
            />
          </div>
          {errors.password && (
            <div className="w-[90%] text-left text-red-500">
              Enter your password
            </div>
          )}
          <button
            type="submit"
            className="w-[90%] p-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
          >
            Get Started
          </button>
          <button
            type="submit"
            className="w-[90%] p-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
            onClick={onRegister}
          >
            Create an Account
          </button>
        </form>
      </div>
    </div>
  );
}
