import React from "react";
import { Timestamp } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Loading from "@components/ui/loading";
import { getCollection } from "@lib/firebase";
import { Collections } from "@lib/constants";
import { useCache } from "@hooks/useCache";

/**
 * Recent Notes component
 */

type Note = {
  authId: string
  name: string
  note: string
  timestamp: Timestamp
}

export default function RecentNotes() {
  const { cache, updateCache } = useCache();
  const cacheLocation = 'notes';
  const notes = React.useMemo(() => cache[cacheLocation], [cache]);

  const fetchNotes = () => {
    getCollection(Collections.Note).then((notesSnapshot) => {
      const tmpNotes: Note[] = [];
      notesSnapshot.docs.map((note) => {
        tmpNotes.push(note.data() as Note);
      });
      updateCache(cacheLocation, tmpNotes);
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
    },
  ];

  if (notes === undefined) return <Loading />;
  return (
    <DataTable columns={columns} data={notes} />
  );
};
