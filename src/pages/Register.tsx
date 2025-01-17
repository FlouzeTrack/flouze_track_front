import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import AuthForm from "@/components/authForm/AuthForm";
import { AuthAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

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
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be less than 32 characters.",
      })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
        const response = await AuthAPI.post("/auth/signup", {
          email: values.email,
          password: values.password,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          login(); // Update auth context
        }

        toast({
          title: "Sign up successful",
          description:
            "Your account has been created successfully! An email has been sent to you to verify your account.",
        });

        // Redirect to dashboard or login page
        navigate("/login");
      } catch (error: any) {
        console.error("Registration failed:", error);
        toast({
          variant: "destructive",
          title: "Registration failed",
          description:
            error.response?.data?.error ||
            "An error occurred during registration",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast, login]
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
