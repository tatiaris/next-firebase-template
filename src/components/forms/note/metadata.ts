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
    schema: z.string({
      message: "Note cannot be empty.",
    }).min(8, {
      message: "Note must be at least 8 characters.",
    })
  },
  {
    name: 'color',
    type: FIELD.SELECT,
    label: 'Color',
    showLabel: false,
    placeholder: 'Choose a color',
    defaultValue: '',
    schema: z.string({
      required_error: "Please select a color.",
    }).min(1, {
      message: "Please select a color.",
    }),
    options: [
      { label: 'Blue', value: '#92c5fd' },
      { label: 'Green', value: '#87efac' },
      { label: 'Yellow', value: '#fde047' },
      { label: 'Red', value: '#fda5a5' },
      { label: 'Purple', value: '#d8b4fe' }
    ]
  }
]