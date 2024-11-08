import React from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Loading from "@components/ui/loading";
import { Note, noteSchema } from "@components/forms/note/metadata";
import { DataTableRowActions } from "./data-table-row-actions";
import useAPI from "@hooks/useAPI";
import { useQuery } from "@tanstack/react-query";
import { TIME } from "@lib/constants";
import Image from "next/image";

/**
 * Recent Notes component
 */

export const getRowColor = (row: Row<Note>) => {
  return noteSchema.parse(row.original).color || 'default';
}

export default function RecentNotes() {
  const api = useAPI();
  const notes = useQuery({ queryKey: ["notes"], staleTime: TIME.ONE_MINUTE, queryFn: api.fetchNotes });

  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "name",
      header: "From",
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <div style={{ color: getRowColor(row) }}>
          {noteSchema.parse(row.original).note}
          {noteSchema.parse(row.original).image && (
            <Image
              src={noteSchema.parse(row.original).image || ''}
              alt="note image"
              className="rounded-sm width-auto height-auto"
              width={100}
              height={100}
            />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
  ];

  if (notes.isLoading) return <Loading />;
  if (notes.isError || notes.data === undefined) return <div>Error: {notes.error?.message}</div>;
  return (
    <DataTable columns={columns} data={notes.data} />
  );
};


