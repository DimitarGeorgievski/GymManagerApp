import {
  Mail,
  Lock,
  User,
  Phone,
  Scale,
  Ruler,
  Calendar,
  User2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { Gender, type RegisterUserReq } from "../../models/user.model";

export function Register() {
  const navigate = useNavigate();
  const onRegister = () => {
    navigate("/login");
  };
  document.title = "Register";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUserReq>({
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: Gender.MALE,
      heightCm: 0,
      phoneNumber: 0,
      weightKg: 0,
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
    mode: "onBlur",
  });
  const onSubmit = async (data: RegisterUserReq) => {
    try {
      const newUser: RegisterUserReq = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        password: data?.password,
        heightCm: Number(data?.heightCm),
        weightKg: Number(data?.weightKg),
        phoneNumber: data?.phoneNumber,
      };
      const response = await api.post("/auth/register", newUser);
      console.log(response);
      const { user } = response.data;
      toast.success("Successfully registered");
      navigate("/");
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
      <div className="md:w-[65%] lg:w-[65%] xl:w-[45%] w-[75%] h-[65vh] shadow-[0px_5px_20px_rgba(0,0,0,0.35)] backdrop-blur-lg rounded-3xl flex flex-col items-center gap-7 ">
        <h1 className="text-center text-2xl pt-8">Register</h1>
        <form
          onSubmit={handleSubmit(async (data) => {
            const user = await onSubmit(data);
            if (user) reset();
          })}
          className="flex flex-col items-center w-[85%] h-20 gap-4"
        >
          <div className="flex gap-4 w-[85%]">
            <div className="flex flex-col w-[50%] gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 flex-col">
                  <div
                    className={`flex p-1 items-center rounded-md bg-[#F1F5F9] ${
                      errors.firstName ? "border-2 border-red-500" : ""
                    }`}
                  >
                    <User color="#808080" />
                    <input
                      className=" focus:outline-none w-full "
                      type="text"
                      placeholder="Enter first name"
                      {...register("firstName", {
                        required: true,
                        maxLength: 50,
                      })}
                    />
                  </div>
                  {errors.firstName && (
                    <div className=" text-left text-red-500">
                      Enter your firstName
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div
                    className={`flex p-1 items-center rounded-md bg-[#F1F5F9] ${
                      errors.lastName ? "border-2 border-red-500" : ""
                    }`}
                  >
                    <User color="#808080" />
                    <input
                      className=" focus:outline-none w-full "
                      type="text"
                      placeholder="Enter last name"
                      {...register("lastName", {
                        required: true,
                        maxLength: 50,
                      })}
                    />
                  </div>
                  {errors.lastName && (
                    <div className=" text-left text-red-500">
                      Enter your last name
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`flex p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
                  errors.email ? "border-2 border-red-500" : ""
                }`}
              >
                <Mail color="#808080" className="w-6 h-6" />
                <input
                  className=" focus:outline-none w-full "
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email && (
                <div className="text-left text-red-500">Enter your email</div>
              )}
              <div
                className={`flex p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
                  errors.password ? "border-2 border-red-500" : ""
                }`}
              >
                <Lock color="#808080" />
                <input
                  className="focus:outline-none w-full "
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: true, maxLength: 50 })}
                />
              </div>
              {errors.password && (
                <div className=" text-left text-red-500">
                  Enter your password
                </div>
              )}
              <div
                className={`flex  p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
                  errors.phoneNumber ? "border-2 border-red-500" : ""
                }`}
              >
                <Phone color="#808080" />
                <input
                  className="focus:outline-none w-full"
                  type="tel"
                  {...register("phoneNumber", {
                    required: true,
                    pattern: /^\+?[0-9]{9,15}$/,
                  })}
                />
              </div>
              {errors.phoneNumber && (
                <div className=" text-left text-red-500">
                  Enter your phone Number
                </div>
              )}
            </div>
            <hr className="border border-[#889aff] w-px h-full" />
            <div className="w-[50%] flex flex-col gap-2">
              <div
                className={`flex  p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
                  errors.weightKg ? "border-2 border-red-500" : ""
                }`}
              >
                <Scale color="#808080" />
                <input
                  className="focus:outline-none w-full "
                  type="number"
                  {...register("weightKg", {
                    required: true,
                    min: 1,
                  })}
                />
              </div>
              {errors.weightKg && (
                <div className=" text-left text-red-500">
                  Enter your weight in kg
                </div>
              )}
              <div
                className={`flex  p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
                  errors.heightCm ? "border-2 border-red-500" : ""
                }`}
              >
                <Ruler color="#808080" />
                <input
                  className="focus:outline-none w-full "
                  type="number"
                  {...register("heightCm", {
                    required: true,
                    min: 1,
                  })}
                />
              </div>
              {errors.heightCm && (
                <div className=" text-left text-red-500">
                  Enter your height in cm
                </div>
              )}
              <div
                className={`flex  p-1 items-center rounded-md gap-2 bg-[#F1F5F9] ${
                  errors.birthDate ? "border-2 border-red-500" : ""
                }`}
              >
                <Calendar color="#808080" />
                <input
                  className="focus:outline-none w-full "
                  type="date"
                  {...register("birthDate", {
                    required: true,
                  })}
                />
              </div>
              {errors.birthDate && (
                <div className=" text-left text-red-500">
                  Enter your height in cm
                </div>
              )}
              <div
                className={`flex  p-2 items-center rounded-md bg-[#F1F5F9] gap-2 ${
                  errors.gender ? "border-2 border-red-500" : ""
                }`}
              >
                <User2 color="#808080" />
                <select
                  id="GenderSelect"
                  className="focus:outline-none  w-full  bg-[#F1F5F9]"
                  {...register("gender", { required: true })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-[85%] flex flex-col  gap-4">
            <button
              type="submit"
              className=" p-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
            >
              Get Started
            </button>
            <button
              type="submit"
              className="p-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={onRegister}
            >
              Already have an Account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
