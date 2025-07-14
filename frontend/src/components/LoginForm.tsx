import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router";
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
import {
  useAppDispatch,
  useAppSelector,
  useQueryParams,
} from "@/hooks/index.js";
import {
  loginUser,
  showMessage as showAuthMessage,
  toggleMessage,
} from "../appState/slices/authSlice.js";
import Alert from "./Alert";
import { cn } from "@/lib/utils.js";
import type { AuthStateType, RootState, MessageType } from "../utils/types";

// form schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginForm: React.FC = () => {
  // states and effect handlers
  const { accessToken, message, showMessage }: AuthStateType = useAppSelector(
    (store: RootState) => store.auth
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const redirectPath = useQueryParams("back_target") || "/";

  useEffect(() => {
    if (showMessage && message) {
      dispatch(toggleMessage({ autoHide: true, delay: 5000 }));
    } else {
      //dispatch(clearMessage());
    }
  }, [showMessage]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      dispatch(showAuthMessage());
      await dispatch(
        loginUser({
          email,
          password,
        })
      ).unwrap();
      navigate({ pathname: redirectPath, search: `?back_target=/login` });
    } catch (error: any) {
      dispatch(toggleMessage({ autoHide: true, delay: 10000 }));
    }
  };

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
    login({ ...values });
  };

  if (accessToken) {
    return <></>;
  }

  return (
    <Form {...loginForm}>
      {showMessage && message && (
        <Alert
          variant={"plain"}
          description={(message as MessageType).description}
          fullWidth={true}
          type={(message as MessageType).type}
        />
      )}
      <form
        onSubmit={loginForm.handleSubmit(formOnSubmit)}
        className="space-y-7 shadow-lg shadow-neutral-300 p-4 md:p-6 xl:px-10 rounded-md border-[.1px] border-neutral-300 w-full md:w-9/10"
      >
        <div>
          <LoginFormField
            name="email"
            placeholder="your email"
            inputType="email"
            control={loginForm.control}
            label="Email"
            autocomplete="current-email"
          />
        </div>
        <div>
          <LoginFormField
            name="password"
            placeholder="your password"
            inputType="password"
            control={loginForm.control}
            label="Password"
            autocomplete="current-password"
          />
        </div>
        <div className="flex flex-col items-center mt-5 md:flex-row md:justify-between md:mt-10 gap-5">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-600 py-5 cursor-pointer w-full md:w-1/3 lg:w-1/4"
          >
            {" "}
            Login{" "}
          </Button>
          <p className="text-muted-600 text-sm text-center md:text-right">
            Don't have an account?&nbsp;&nbsp;
            <span className="font-semibold text-primary hover:underline hover:underline-offset-4 hover:decoration-2 hover:cursor-pointer">
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </form>
    </Form>
  );
};

type LoginFormPropsType = {
  name: FieldPath<z.infer<typeof formSchema>>;
  control: Control<z.infer<typeof formSchema>, any>;
  placeholder?: string;
  inputType: string;
  description?: string;
  label?: string;
  inputClassName?: string;
  autocomplete?: string;
};

const LoginFormField: React.FC<LoginFormPropsType> = ({
  inputClassName,
  control,
  description,
  inputType,
  label,
  name,
  placeholder,
  autocomplete,
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-neutral-800 font-medium mb-1">
            {" "}
            {label}{" "}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              type={inputType}
              className={cn(
                "py-6 [&::placeholder]:text-sm [&::placeholder]:text-muted",
                inputClassName
              )}
              autoComplete={autocomplete}
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
