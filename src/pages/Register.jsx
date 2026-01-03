import { SignUp } from "@clerk/clerk-react";

    export default function RegisterPage() {
      return (
        <div className="flex justify-center items-center py-12">
          <SignUp path="/register" />
        </div>
      );
    }