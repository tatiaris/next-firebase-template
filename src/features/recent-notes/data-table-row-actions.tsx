import React from "react";
import { useAuth } from "@hooks/useAuth";
import { useCache } from "@hooks/useCache";
import { Row } from "@tanstack/react-table";
import { deleteDocById, updateObjectById } from "@lib/firebase";
import { Collections } from "@lib/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@components/ui/drawer";
import { Textarea } from "@components/ui/textarea";
import { Note, noteSchema } from "@components/forms/note/metadata";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const auth = useAuth();
  const { cache, updateCache } = useCache();
  const note = noteSchema.parse(row.original);
  const [updatedNote, setUpdatedNote] = React.useState<string>(note.note);
  const [inProgress, setInProgress] = React.useState(false);

  const saveUpdatedNote = () => {
    setInProgress(true);
    updateObjectById(Collections.Note, note.id, { note: updatedNote }).then(() => {
      updateCache('notes', cache['notes'].map((n: Note) => n.id === note.id ? { ...n, note: updatedNote } : n));
      setInProgress(false);
    }).catch((error) => {
      console.error("Error updating note", error);
      setInProgress(false);
    });
  }

  const handleDelete = () => {
    setInProgress(true);
    deleteDocById(Collections.Note, note.id).then(() => {
      updateCache('notes', cache['notes'].filter((n: Note) => n.id !== note.id));
      setInProgress(false);
    }).catch((error) => {
      console.error("Error deleting note", error);
      setInProgress(false);
    });
  }

  if (auth.user?.uid !== note.userId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-right" asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem className="cursor-pointer size-full" disabled={inProgress} asChild>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="size-full py-1.5">Edit</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit note</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <Textarea
                  placeholder="Enter your note here"
                  value={updatedNote}
                  onChange={(e) => setUpdatedNote(e.target.value)}
                />
              </div>
              <DrawerFooter>
                <Button disabled={inProgress} onClick={saveUpdatedNote}>Save</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer bg-destructive focus:bg-red-600" disabled={inProgress} onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}