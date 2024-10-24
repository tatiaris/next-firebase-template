import React from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Loading from "@components/ui/loading";
import { getCollectionWithIds } from "@lib/firebase";
import { Collections } from "@lib/constants";
import { useCache } from "@hooks/useCache";
import { Note, noteSchema } from "@components/forms/note/metadata";
import { DataTableRowActions } from "./data-table-row-actions";

/**
 * Recent Notes component
 */
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


