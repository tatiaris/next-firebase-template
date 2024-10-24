"use client";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Icons } from "../../ui/icons";
import { z } from "zod";
import { Form } from "../../ui/form";
import { cn } from "@lib/utils";
import { useToast } from "@hooks/useToast";
import { useAuth } from "@hooks/useAuth";
import { addObjectToCollection } from "@lib/firebase";
import { Timestamp } from "firebase/firestore";
import { Collections } from "@lib/constants";
import { useCache } from "@hooks/useCache";
import { buildForm, resetForm } from "../utils";
import { FIELDS } from "./metadata";
import { FieldsRenderer } from "../fields-renderer";

export default function NoteForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { form, schema } = buildForm(FIELDS);
  const { toast } = useToast();
  const { cache, updateCache } = useCache();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true);
    const noteObj = {
      userId: auth.user?.uid,
      name: auth.user?.displayName || auth.user?.email,
      timestamp: Timestamp.now(),
      ...values
    }
    const id = await addObjectToCollection(Collections.Note, noteObj);
    updateCache('notes', [{ id, ...noteObj }, ...cache.notes]);
    resetForm(form, FIELDS);
    toast({ title: "Note shared!" });
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <FieldsRenderer form={form} fields={FIELDS} />
            </div>
            <Button
              type="submit"
              automation-id="btn-share-note"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Share
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
