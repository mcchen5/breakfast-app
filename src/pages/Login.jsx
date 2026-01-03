 import { SignIn } from "@clerk/clerk-react";

    export default function LoginPage() {
      return (
        <div className="flex justify-center items-center py-12">
          <SignIn path="/login" />
        </div>
      );
    }