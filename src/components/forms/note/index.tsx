"use client";
import React from "react";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAPI from "@hooks/useAPI";
import { useToast } from "@hooks/useToast";
import { cn } from "@lib/utils";
import { Form } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { Icons } from "@components/ui/icons";
import { useAuth } from "@hooks/useAuth";
import { FIELDS, Note } from "./metadata";
import { FieldsRenderer } from "../fields-renderer";
import { buildForm, FORM_TYPE, resetForm } from "../utils";

/**
 * NoteForm component
 */

type NoteFormProps = React.HTMLAttributes<HTMLDivElement> & {
  formType: FORM_TYPE,
  note?: Note
};

export default function NoteForm({ formType, className, ...props }: NoteFormProps) {
  const auth = useAuth();
  const api = useAPI();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isUpdateForm = formType === FORM_TYPE.UPDATE;
  const note = isUpdateForm ? props.note as Note : {} as Note;
  const { form, schema } = buildForm(FIELDS, isUpdateForm ? { defaultValues: note } : {});
  const [updatedValues, setUpdatedValues] = React.useState<Partial<Note>>({});

  const createNote = useMutation({
    mutationKey: ["notes"],
    mutationFn: (values: z.infer<typeof schema>) => {
      if (!auth.user || !api || !auth.user.email) throw new Error("Something went wrong");
      return api.addNote({
        userId: auth.user.uid,
        name: auth.user.displayName || auth.user.email,
        timestamp: Timestamp.now(),
        ...values,
      }) as Promise<Note>;
    },
    onSuccess: (newNote) => {
      resetForm(form, FIELDS);
      toast({ title: "Note shared!" });
      queryClient.setQueryData(['notes'], (old: Note[]) => [newNote, ...old]);
    },
    onError: (error) => {
      toast({ title: "Error sharing note", description: error.message });
    }
  });

  const updateNote = useMutation({
    mutationKey: ["notes"],
    mutationFn: (updatedNote: Partial<Note>) => api?.updateNote({ id: note.id, ...updatedNote }) as Promise<void>,
    onSuccess: () => {
      queryClient.setQueryData(['notes'], (old: Note[]) => old.map((n) => n.id === note.id ? { ...n, ...updatedValues } : n));
      toast({ title: "Note updated!" });
    },
    onError: (error) => {
      toast({ title: "Error updating note", description: error.message });
    }
  });

  async function onCreateSubmit(values: z.infer<typeof schema>) {
    createNote.mutate(values);
  }

  async function onUpdateSubmit(values: z.infer<typeof schema>) {
    setUpdatedValues(values);
    updateNote.mutate(values);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(isUpdateForm ? onUpdateSubmit : onCreateSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <FieldsRenderer form={form} fields={FIELDS} formType={formType} />
            </div>
            <Button
              type="submit"
              automation-id="btn-share-note"
              disabled={createNote.isPending || updateNote.isPending}
            >
              {(createNote.isPending || updateNote.isPending) && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {formType === FORM_TYPE.CREATE ? "Share" : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
