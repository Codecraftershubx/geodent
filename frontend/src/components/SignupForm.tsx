import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import api from "../utils/api";

// form schema
const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const SignUpForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const [formValues, setFormValues] = useState({});
  const [toSubmit, setToSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // submit form values
    const submitForm = async () => {
      console.log("form values:", formValues);
      const res = await api.post("/auth/signup", {
        data: { data: { ...formValues } },
      });
      console.log(res);
      if (res.error) {
        toast.error(`Failed: ${res.data.header.message}`);
      } else {
        toast.success(`Account created`);
        navigate("/login");
      }
      setToSubmit(false);
    };
    // call handler function
    if (toSubmit) {
      console.log(formValues);
      submitForm();
    }
  }, [formValues, toSubmit]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setFormValues({ ...values });
    setToSubmit(true);
  };

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-3 items-start">
          <SignUpFormField
            name="firstName"
            label="First Name"
            placeholder="James"
            formControl={form.control}
            className="flex-1 w-full md:basis-1/2"
          />
          <SignUpFormField
            name="lastName"
            label="Last Name"
            placeholder="Jackson"
            formControl={form.control}
            className="flex-1 w-full md:basis-1/2"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-start">
          <SignUpFormField
            name="email"
            label="Email"
            placeholder="enter your email here"
            inputType="email"
            formControl={form.control}
            className="flex-1 w-full md:basis-1/2"
          />
          <SignUpFormField
            name="password"
            label="Password"
            placeholder="your password"
            inputType="password"
            formControl={form.control}
            className="flex-1 w-full md:basis-1/2"
          />
        </div>
        <Button
          type="submit"
          className="bg-red-600 shadow-none cursor-pointer hover:bg-red-700"
        >
          {" "}
          Sign up{" "}
        </Button>
      </form>
    </Form>
  );
};

type TSignUpFormField = {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  className?: string;
  formControl: Control<z.infer<typeof formSchema>, any>;
};

const SignUpFormField: React.FC<TSignUpFormField> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
  className,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className={className || ""}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              {...field}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SignUpForm;
