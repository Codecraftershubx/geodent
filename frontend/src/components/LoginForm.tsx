import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  useForm,
} from "react-hook-form";
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
import { useAppDispatch, useAppSelector } from "../appState/hooks.js";
import {
  loginUser,
  clearMessage,
  showMessage as showAuthMessage,
  toggleMessage,
} from "../appState/slices/authSlice.js";
import Alert from "./Alert";
import type { RootState } from "../utils/types";

// form schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginForm: React.FC<{ to: string }> = ({ to }) => {
  // states and effect handlers
  const { accessToken, message, showMessage } = useAppSelector(
    (store: RootState) => store.auth,
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
        }),
      ).unwrap();
      navigate(to);
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
          description={message.description}
          fullWidth={true}
          type={message.type}
        />
      )}
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
      render={({ field }: { field: ControllerRenderProps }) => (
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
