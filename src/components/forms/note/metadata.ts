import { z } from "zod";
import { FIELD, FieldObject } from "../utils";

export const FIELDS: FieldObject[] = [
  {
    name: 'note',
    type: FIELD.TEXTAREA,
    label: 'Note',
    showLabel: false,
    placeholder: 'Share a note with the world!',
    defaultValue: '',
    autoComplete: '',
    schema: z.string().min(8, {
      message: "Note must be at least 8 characters.",
    })
  }
]