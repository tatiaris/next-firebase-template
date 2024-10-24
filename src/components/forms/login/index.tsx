"use client";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Icons } from "../../ui/icons";
import { Form } from "../../ui/form";
import { signInWithEmailPassword, signInWithGooglePopup } from "@lib/firebase";
import { cn } from "@lib/utils";
import { buildForm } from "../utils";
import { FIELDS } from "./metadata";
import { FieldsRenderer } from "../fields-renderer";

export default function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { form } = buildForm(FIELDS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onSubmit(values: { email: string, password: string }) {
    setIsLoading(true);
    signInWithEmailPassword(values.email, values.password)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        form.setError("root", {
          type: "manual",
          message: "Invalid email or password.",
        });
      });
  }

  async function handleSignInWithGoogle() {
    setIsLoading(true);
    signInWithGooglePopup()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FieldsRenderer form={form} fields={FIELDS} />
            </div>
            <Button
              type="submit"
              automation-id="btn-sign-in"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleSignInWithGoogle}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
