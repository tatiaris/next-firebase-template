import React from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Loading from "@components/ui/loading";
import { Note, noteSchema } from "@components/forms/note/metadata";
import { DataTableRowActions } from "./data-table-row-actions";
import useAPI from "@hooks/useAPI";
import { useQuery } from "@tanstack/react-query";

/**
 * Recent Notes component
 */
export default function RecentNotes() {
  const api = useAPI();
  const notes = useQuery({ queryKey: ["notes"], queryFn: api?.fetchNotes });

  const getRowColor = (row: Row<Note>) => {
    return noteSchema.parse(row.original).color || 'default';
  }

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

  if (notes.isLoading) return <Loading />;
  if (notes.isError || notes.data === undefined) return <div>Error: {notes.error?.message}</div>;
  return (
    <DataTable columns={columns} data={notes.data} />
  );
};


