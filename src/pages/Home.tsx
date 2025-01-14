import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => (
  <>
    <div className="flex justify-end gap-4 p-4">
      <Button variant="outline">
        <Link to="/login">Login</Link>
      </Button>
      <Button variant="default">
        <Link to="/register">Register</Link>
      </Button>
    </div>
    <div className="flex flex-col mt-8 gap-4 py-4">
      <div className="flex items-center flex-col mt-8">
        <h1 className="text-5xl font-bold">Get started!</h1>
        <p className="text-lg mt-4 text-secondary-foreground">
          Welcome to FlouzeTrack! Get started by logging in or registering.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">Track your expenses</h2>
          <p className="text-lg text-secondary-foreground">
            Keep track of your expenses and manage your finances with ease.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">Stay organized</h2>
          <p className="text-lg text-secondary-foreground">
            Organize your expenses into categories and keep track of your
            spending.
          </p>
        </div>
      </div>
    </div>
  </>
);

export default Home;
