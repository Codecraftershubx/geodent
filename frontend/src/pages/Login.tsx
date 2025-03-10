import { Link } from "react-router-dom";
import SignUpForm from "../components/SignupForm";

const Login = () => {
  return (
    <main className="flex flex-col justify-between items-center min-h-screen py-10 px-2 md:p-24 ">
      <section className="w-9/10 md:max-w-2xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-500 mb-5">Sign Up</h1>
          <p className="text-sm text-zinc-500">
            Already have an account?{"  "}
            <Link
              to="#"
              className="underline underline-offset-4 font-semibold text-red-400"
            >
              Login
            </Link>{" "}
          </p>
        </div>
        <SignUpForm />
      </section>
    </main>
  );
};

export default Login;
