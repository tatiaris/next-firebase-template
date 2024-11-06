"use client";
import { useAuth } from "@hooks/useAuth";
import Loading, { LoadingComponent } from "@components/ui/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@components/ui/input";
import useDebounce from "@hooks/useDebounce";
import useAPI from "@hooks/useAPI";
import { Note, noteSchema } from "@components/forms/note/metadata";
import { ColumnDef } from "@tanstack/react-table";
import { getRowColor } from "@features/recent-notes";
import { DataTable } from "@features/recent-notes/data-table";
import { Timestamp } from "firebase/firestore";

const cleanupNotes = (notes: Note[]) => notes.map((note) => {
  if (!(note.timestamp instanceof Timestamp)) {
    note.timestamp = new Timestamp(note.timestamp._seconds, note.timestamp._nanoseconds);
  }
  return note;
});

export default function Search() {
  const router = useRouter();
  const { isGuest, isLoading } = useAuth();
  const api = useAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [inProgress, searchResults] = useDebounce<Note[]>(api.queryNotes, searchQuery, cleanupNotes);

  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "name",
      header: "From",
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => <div style={{ color: getRowColor(row) }}>{noteSchema.parse(row.original).note}</div>,
    }
  ];

  useEffect(() => {
    if (isGuest && !isLoading) {
      router.replace("/");
    }
  }, [isGuest, isLoading, router]);

  if (isLoading) {
    return (
      <div className="py-8 px-8">
        <Loading component={LoadingComponent.UserBadge} />
      </div>
    );
  }

  if (isGuest) return null;

  return (
    <div className="py-8 px-8">
      <Input name="note search" placeholder="Search for a note" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <br />
      {inProgress ? <Loading /> : <DataTable columns={columns} data={searchResults} />}
    </div>
  );
}
