import React, { useState } from "react";
import { AuthAPI } from "../services/api";
import { Bitcoin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [msg, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    error && setError("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError(t("auth.errorInvalidEmail"));
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await AuthAPI.post("/auth/forgot-password", { email });
      setMessage(data.message);
      toast && toast({ title: "Success", description: data.message });
      setError("");
    } catch (error) {
      setError(t("auth.errorSendFailed"));
      toast({
        title: t("auth.errorSendFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className={`flex flex-col gap-4 p-6 md:p-10 relative order-first`}>
        <div className="flex flex-col items-center gap-8 md:items-start absolute top-6 left-6">
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
              <h1 className="text-2xl font-bold text-center mb-4">
                {t("auth.forgotPassword")}
              </h1>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              aria-label="Forgot Password Form"
            >
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Email"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary-foreground text-primary-foreground"
                aria-label="Send reset password link"
              >
                {isLoading ? t("auth.sending") : t("auth.sendResetPassword")}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/login_picture.jpeg"
          alt="ETH picture"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
