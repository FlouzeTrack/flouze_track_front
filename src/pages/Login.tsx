import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "@/components/authForm/AuthForm";
import { AuthAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const image = "/login_picture.jpeg";

type FormErrors = Record<string, { message?: string }>;

type FormValues = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function SignIn() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
        const response = await AuthAPI.post("/auth/signin", {
          email: values.email,
          password: values.password,
        });

        if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          login(); // Update auth context

          toast({
            title: "Login successful",
            description: `Welcome back!`,
          });

          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Login failed:", error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.response?.data?.error || "Invalid credentials",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast, login]
  );

  return (
    <AuthForm<FormValues>
      title="Login"
      description="Enter your details to login to your account"
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
      ]}
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      isLoading={isLoading}
      image={image}
      buttonText="Login"
      forgotPassword={true}
      redirectText="Didn't have an account? "
      redirectButton="Register"
      redirectLink="/register"
      reverseGrid={false}
    />
  );
}
