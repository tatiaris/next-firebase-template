import { z } from "zod";
import { FIELD, FieldObject } from "../utils";
import { Timestamp } from "firebase/firestore";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const FIELDS: FieldObject[] = [
  {
    name: 'note',
    type: FIELD.TEXTAREA,
    label: 'Note',
    showLabel: false,
    allowUpdate: true,
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
    allowUpdate: true,
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
  },
  {
    name: 'image',
    type: FIELD.IMAGE,
    label: 'Image',
    showLabel: false,
    allowUpdate: true,
    placeholder: 'Attach image',
    schema: z.instanceof(File).or(z.string()).refine(file => typeof file === 'string' || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), {
      message: "File must be an image.",
    }).refine(file => typeof file === 'string' || (file instanceof File && file.size <= MAX_FILE_SIZE), {
      message: "Image can't be larger than 5MB.",
    }).optional(),
  }
]

export type Note = {
  id: string
  userId: string
  name: string
  note: string
  color: string
  image?: string
  keywords?: string[]
  timestamp: Timestamp | {
    _seconds: number
    _nanoseconds: number
  }
}

export const noteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  note: z.string(),
  color: z.string(),
  image: z.string().optional(),
  timestamp: z.instanceof(Timestamp),
})
