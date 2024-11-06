import React from "react";
import { useAuth } from "@hooks/useAuth";
import { Row } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@components/ui/drawer";
import { Button } from "@components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Note, noteSchema } from "@components/forms/note/metadata";
import { useToast } from "@hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAPI from "@hooks/useAPI";
import NoteForm from "@components/forms/note";
import { FORM_TYPE } from "@components/forms/utils";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const auth = useAuth();
  const api = useAPI();
  const note = noteSchema.parse(row.original);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteNote = useMutation({
    mutationKey: ["notes"],
    mutationFn: (note: Note) => api.deleteNote(note) as Promise<string>,
    onSuccess: () => {
      queryClient.setQueryData(['notes'], (old: Note[]) => old.filter((n) => n.id !== note.id));
      toast({ title: "Note deleted!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting note", description: error.message });
    }
  });

  const handleDelete = () => deleteNote.mutate(note)

  if (auth.user?.uid !== note.userId) return null;

  return (
    <DropdownMenu>
      <div className="flex justify-end">
        <DropdownMenuTrigger className="text-right" asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            aria-label="Open menu"
            automation-id="btn-open-menu"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-[160px]" aria-describedby="edit note">
        <DropdownMenuItem className="cursor-pointer size-full" disabled={deleteNote.isPending} asChild>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="size-full py-1.5">Edit</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit note</DrawerTitle>
              </DrawerHeader>
              <DrawerDescription></DrawerDescription>
              <div className="px-4">
                <NoteForm formType={FORM_TYPE.UPDATE} note={note} />
              </div>
            </DrawerContent>
          </Drawer>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer bg-destructive focus:bg-red-600" disabled={deleteNote.isPending} onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}