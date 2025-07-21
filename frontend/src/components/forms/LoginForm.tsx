import React from "react";
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
import { cn } from "@/lib/utils.js";
import { Link } from "react-router-dom";
import Loader from "@/components/utils/Loader";

// form schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginForm: React.FC<LoginFormPropsType> = ({
  disabled,
  setFormCredentials,
  className,
}) => {
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
    setFormCredentials({ ...values });
  };

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(formOnSubmit)}
        className={cn(
          "space-y-7 shadow-lg shadow-neutral-300 p-4 md:p-6 xl:px-10 rounded-md border-[.1px] border-neutral-300 w-full",
          className
        )}
      >
        <div>
          <LoginFormField
            name="email"
            placeholder="your email"
            inputType="email"
            control={loginForm.control}
            label="Email"
            autocomplete="current-email"
            disabled={disabled}
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
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col items-center mt-5 md:flex-row md:justify-between md:mt-10 gap-5">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-600 disabled:bg-primary-600 py-5 cursor-pointer w-full md:w-1/3 lg:w-1/4 flex gap-3"
            disabled={disabled}
          >
            {disabled && (
              <Loader
                size={"4"}
                className="text-neutral-300 fill-neutral-100"
              />
            )}
            Login
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

/**
 * @func LoginFormField form field component
 */
const LoginFormField: React.FC<FormFieldPropsType> = ({
  inputClassName,
  control,
  description,
  inputType,
  label,
  name,
  placeholder,
  autocomplete,
  disabled,
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
              disabled={disabled}
              aria-disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// types
type LoginFormValuesType = {
  email: string;
  password: string;
};

type FormFieldPropsType = {
  name: FieldPath<z.infer<typeof formSchema>>;
  control: Control<z.infer<typeof formSchema>, any>;
  placeholder?: string;
  inputType: string;
  description?: string;
  label?: string;
  inputClassName?: string;
  autocomplete?: string;
  disabled: boolean;
};

type LoginFormPropsType = {
  disabled: boolean;
  setFormCredentials: React.Dispatch<
    React.SetStateAction<LoginFormValuesType | null>
  >;
  className?: string;
};

export default LoginForm;
export type { LoginFormValuesType };
