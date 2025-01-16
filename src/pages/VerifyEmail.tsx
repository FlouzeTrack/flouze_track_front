import { useState, useEffect } from "react";
import { AuthAPI } from "../services/api";
import { NavLink } from "react-router-dom";
import { ArrowLeft, Bitcoin } from "lucide-react";

interface VerifyEmailResponse {
  message: string;
}

const VerifyEmail = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = window.location.pathname.split("/").pop();
      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }
      localStorage.setItem("token", token);
      setLoading(true);
      try {
        const { data } = await AuthAPI.post<VerifyEmailResponse>(
          "/auth/verify-email"
        );
        setMessage(data.message);
      } catch (error: any) {
        setMessage(
          error.response?.data?.message || "Email verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, []);

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
          <NavLink
            to="/login"
            className="text-sm text-card-foreground mr-auto flex items-center gap-2"
          >
            <ArrowLeft />
            Return to login
          </NavLink>
        </div>
        <div className={`flex flex-1 items-center justify-center py-12`}>
          <div className="mx-auto grid w-[350px] gap-6">
            <h1 className="text-2xl font-bold text-center">Verify Email</h1>
            {loading ? (
              <div className="text-center">Verifying...</div>
            ) : (
              message && <div className="text-center">{message}</div>
            )}
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

export default VerifyEmail;
