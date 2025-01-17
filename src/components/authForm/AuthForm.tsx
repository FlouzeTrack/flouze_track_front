import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldValues, UseFormReturn, FieldErrors, Path } from "react-hook-form";
import { Bitcoin, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Field<V> {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  name: Path<V>;
}

interface AuthFormProps<V extends FieldValues> {
  title: string;
  description: string;
  fields: Field<V>[];
  form: UseFormReturn<V>;
  onSubmit: (values: V) => void;
  onError: (errors: FieldErrors<V>) => void;
  isLoading: boolean;
  image: string;
  buttonText: string;
  forgotPassword?: boolean;
  redirectText: string;
  redirectButton: string;
  redirectLink: string;
  reverseGrid?: boolean;
}

export default function AuthForm<V extends FieldValues>({
  title,
  description,
  fields,
  form,
  onSubmit,
  onError,
  isLoading,
  image,
  buttonText,
  forgotPassword,
  redirectText,
  redirectButton,
  redirectLink,
  reverseGrid = false,
}: AuthFormProps<V>) {
  const orderClasses = reverseGrid ? "lg:order-last" : "lg:order-first";

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div
        className={`flex flex-col gap-4 p-6 md:p-10 relative ${orderClasses}`}
      >
        <div className="flex justify-center gap-2 md:justify-start absolute top-6 left-6">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bitcoin className="size-4" />
            </div>
            FlouzeTrack
          </a>
        </div>
        <div className={`flex flex-1 items-center justify-center py-12`}>
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="mx-auto grid w-[300px] text-balance text-muted-foreground">
                {description}
              </p>
            </div>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(onSubmit, onError)}
            >
              {fields.map((field) => (
                <div className="grid gap-2" key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <div className="relative">
                    <Input
                      id={field.id}
                      className={"bg-background"}
                      type={
                        field.type === "password" && isPasswordVisible
                          ? "text"
                          : field.type
                      }
                      placeholder={field.placeholder}
                      {...form.register(field.name)}
                    />
                    {field.type === "password" && (
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {buttonText}
              </Button>
              {forgotPassword && (
                <NavLink
                  to="/forgot-password"
                  className="text-sm text-card-foreground"
                >
                  Forgot password?
                </NavLink>
              )}
            </form>
            <div className="mt-4 text-center text-sm">
              {redirectText}
              <NavLink to={redirectLink} className="underline">
                {redirectButton}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={image}
          alt="ETH picture"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
