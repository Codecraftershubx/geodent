import { Toaster } from "react-hot-toast";
import components from "../components/index";

const Login = () => {
  return (
    <main className="flex flex-col justify-between items-center min-h-screen py-10 px-2 md:p-24 ">
      <Toaster />
      <section className="w-9/10 sm:max-w-md max-w-lg">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-500 mb-5">Login</h1>
          <p className="text-sm text-zinc-500">Sigin into your account</p>
        </div>
        <components.LoginForm />
      </section>
    </main>
  );
};

export default Login;
