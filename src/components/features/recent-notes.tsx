import React from "react";
import { Timestamp } from "firebase/firestore";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Loading from "@components/ui/loading";
import { deleteDocById, getCollectionWithIds, updateObjectById } from "@lib/firebase";
import { Collections } from "@lib/constants";
import { useCache } from "@hooks/useCache";
import { z } from "zod";
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { useAuth } from "@hooks/useAuth";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@components/ui/drawer";
import { Textarea } from "@components/ui/textarea";

/**
 * Recent Notes component
 */

type Note = {
  id: string
  userId: string
  name: string
  note: string
  color?: string
  timestamp: Timestamp
}

const noteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  note: z.string(),
  color: z.string().optional(),
  timestamp: z.instanceof(Timestamp),
})

export default function RecentNotes() {
  const { cache, updateCache } = useCache();
  const cacheLocation = 'notes';
  const notes = React.useMemo(() => cache[cacheLocation], [cache]);

  const getRowColor = (row: Row<Note>) => {
    return noteSchema.parse(row.original).color || 'default';
  }

  const fetchNotes = () => {
    getCollectionWithIds(Collections.Note).then((notesList) => {
      updateCache(cacheLocation, notesList);
    });
  }

  React.useEffect(() => {
    if (notes === undefined) fetchNotes();
  }, [notes, fetchNotes]);

  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "name",
      header: "From",
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => <div style={{ color: getRowColor(row) }}>{noteSchema.parse(row.original).note}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
  ];

  if (notes === undefined) return <Loading />;
  return (
    <DataTable columns={columns} data={notes} />
  );
};


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
