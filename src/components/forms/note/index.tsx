"use client";
import React from "react";
import useFirebase from "@hooks/useFirebase";
import { Timestamp } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@hooks/useToast";
import { cn, getUploadedFileUrl, replaceFile } from "@lib/utils";
import { Form } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { Icons } from "@components/ui/icons";
import { FIELDS, Note } from "./metadata";
import { FieldsRenderer } from "../fields-renderer";
import { buildForm, FORM_TYPE, resetForm } from "../utils";
import { FormImagePreview } from "@features/form-image-preview";
import { Collection } from "@lib/constants";

type NoteFormProps = React.HTMLAttributes<HTMLDivElement> & {
  formType: FORM_TYPE;
  note?: Note;
};

export default function NoteForm({ formType, className, ...props }: NoteFormProps) {
  const { user, db } = useFirebase();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isUpdateForm = formType === FORM_TYPE.UPDATE;
  const note = isUpdateForm ? (props.note as Note) : ({} as Note);
  const form = buildForm(FIELDS, isUpdateForm ? { defaultValues: note } : {});

  const noteMutation = useMutation({
    mutationKey: ["notes"],
    mutationFn: async (values: Partial<Note>) => {
      if (!user || !user.email) throw new Error("User not authenticated");
      values.keywords = values.note?.toLowerCase().split(/\s+/);
      if (values.image) values.image = (isUpdateForm ? await replaceFile(db, note.image, values.image) : await getUploadedFileUrl(db, values.image))
      if (!values.image) delete values.image;

      if (isUpdateForm) {
        await db.updateObject(Collection.Note, note.id, values);
        return { ...note, ...values } as Note;
      }
      return db.addObject(Collection.Note, {
        userId: user.uid,
        name: user.displayName || user.email,
        timestamp: Timestamp.now(),
        ...values,
      } as Note);
    },
    onSuccess: (newNote) => {
      resetForm(form, FIELDS);
      queryClient.setQueryData<Note[]>(['notes'], (old = []) =>
        isUpdateForm ? old.map(n => (n.id === note.id ? { ...n, ...newNote } : n)) : [newNote, ...old]);
      toast({ title: isUpdateForm ? "Note updated!" : "Note shared!" });
    },
    onError: (error: any) => {
      toast({ title: "Error saving note", description: error.message });
    },
  });

  const onFormSubmit = (values: Partial<Note>) => {
    noteMutation.mutate(values);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div className="grid gap-2">
            <FieldsRenderer form={form} fields={FIELDS} formType={formType} />
            <FormImagePreview form={form} field="image" />
            <Button type="submit" automation-id="btn-share-note" disabled={noteMutation.isPending}>
              {noteMutation.isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {formType === FORM_TYPE.CREATE ? "Share" : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
