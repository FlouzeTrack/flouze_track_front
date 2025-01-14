import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "@/components/authForm/AuthForm";

const image = "/register_picture.png";

type FormErrors = Record<string, { message?: string }>;

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const formSchema = z
  .object({
    email: z.string().email({
      message: "Email must be a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onError = useCallback(
    (errors: FormErrors) => {
      Object.values(errors).forEach((error) => {
        toast({
          variant: "destructive",
          title: "Form submission failed",
          description: error.message,
        });
      });
    },
    [toast]
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsLoading(true);
      try {
        toast({
          title: "Sign up successful",
          description: `Welcome, ${values.email}!`,
        });
        navigate("/login");
      } catch (error) {
        console.error("err", error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: `Error: ${(error as Error).message}`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast]
  );

  return (
    <AuthForm<FormValues>
      title="Sign Up"
      description="Enter your details to create a new account"
      fields={[
        {
          label: "Email",
          type: "email",
          id: "email",
          placeholder: "johndoe@gmail.com",
          name: "email",
        },
        {
          label: "Password",
          type: "password",
          id: "password",
          placeholder: "",
          name: "password",
        },
        {
          label: "Confirm Password",
          type: "password",
          id: "confirmPassword",
          placeholder: "",
          name: "confirmPassword",
        },
      ]}
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      isLoading={isLoading}
      image={image}
      buttonText="Register"
      redirectText="Already have an account? "
      redirectButton="Login"
      redirectLink="/login"
      reverseGrid={true}
    />
  );
}
