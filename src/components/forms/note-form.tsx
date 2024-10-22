"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { cn } from "@lib/utils";
import { Textarea } from "@components/ui/textarea";
import { useToast } from "@hooks/useToast";
import { useAuth } from "@hooks/useAuth";
import { addObjectToCollection } from "@lib/firebase";
import { Timestamp } from "firebase/firestore";
import { Collections } from "@lib/constants";
import { useCache } from "@hooks/useCache";

const formSchema = z.object({
  note: z.string().min(8, {
    message: "note must be at least 8 characters.",
  }),
});

export default function NoteForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
    },
  });
  const { toast } = useToast();
  const { cache, updateCache } = useCache();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const noteObj = {
      note: values.note,
      userId: auth.user?.uid,
      name: auth.user?.displayName || auth.user?.email,
      timestamp: Timestamp.now(),
    }
    await addObjectToCollection(Collections.Note, noteObj);
    updateCache('notes', [noteObj, ...cache.notes]);
    form.reset(
      {
        note: "",
      },
      {
        keepValues: false,
        keepDefaultValues: false,
      }
    )
    toast({
      title: "Note shared!",
      description: values.note,
    });
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Share a note with the world!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
