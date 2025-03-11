import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../utils/api";
import type { TBEResponse } from "../utils/types";

// Types
type TRequestData = {
  [key: string]: any;
};

type TLoginFormProps = {
  accessToken: string | null;
  tokenSuccess: boolean;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

// form schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginForm: React.FC<TLoginFormProps> = ({
  accessToken,
  tokenSuccess,
  setAccessToken,
  setIsLoggedIn,
  setTokenSuccess,
}) => {
  // states and effect handlers
  const [credentials, setCredentials] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    const requestData: TRequestData = { data: credentials };
    if (accessToken) {
      console.log("logging user in...using token");
      requestData["headers"] = { Authorization: `Bearer ${accessToken}` };
    }
    const res: TBEResponse = await api.post("/auth/login", requestData);
    if (res.error) {
      console.log(res.data);
      if (res.data.header.message === "access token expired") {
        window.localStorage.removeItem("accessToken");
        setTokenSuccess(false);
      } else {
        toast.error(`Failed: ${res.data.header.message}`);
      }
    } else {
      console.log(res);
      setIsLoggedIn(true);
      if (res.data.data) {
        const token = res.data.data[0].accessToken;
        if (!accessToken) {
          window.localStorage.setItem("accessToken", token);
          setAccessToken(token);
        }
      }
      toast.success("Logging you in");
      navigate("/listings");
    }
  };

  useEffect(() => {
    console.log("useEffect: isloggedin:", isSubmitted);
    // login request hander
    if (isSubmitted || accessToken) {
      handleLogin();
    }
  }, [isSubmitted, tokenSuccess]);

  // Form Definition
  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // form action
  const formOnSubmit = (values: z.infer<typeof formSchema>) => {
    setCredentials({ ...values });
    setIsSubmitted(true);
  };
  if (accessToken && tokenSuccess) {
    return <></>;
  }
  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(formOnSubmit)}
        className="space-y-5"
      >
        <div>
          <LoginFormField
            name="email"
            placeholder="your email"
            inputType="email"
            control={loginForm.control}
            label="Email"
            inputClassName="py-5"
          />
        </div>
        <div>
          <LoginFormField
            name="password"
            placeholder="your password"
            inputType="password"
            control={loginForm.control}
            label="Password"
            inputClassName="py-5"
          />
        </div>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          {" "}
          Login{" "}
        </Button>
      </form>
    </Form>
  );
};

type LoginFormType = {
  name: FieldPath<z.infer<typeof formSchema>>;
  control: Control<z.infer<typeof formSchema, any>>;
  placeholder?: string;
  inputType: string;
  description?: string;
  label?: string;
  inputClassName?: string;
};

const LoginFormField: React.FC<LoginFormType> = ({
  inputClassName,
  control,
  description,
  inputType,
  label,
  name,
  placeholder,
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel> {label} </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              type={inputType}
              className={inputClassName || ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LoginForm;
