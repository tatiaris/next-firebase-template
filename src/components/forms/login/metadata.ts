import { z } from "zod";
import { FIELD, FieldObject } from "../utils";

export const FIELDS: FieldObject[] = [
  {
    name: 'email',
    type: FIELD.INPUT,
    label: 'Email',
    showLabel: false,
    placeholder: 'username@example.com',
    allowUpdate: false,
    defaultValue: '',
    autoComplete: 'email',
    schema: z.string().email({
      message: "Invalid email address.",
    })
  },
  {
    name: 'password',
    type: FIELD.INPUT,
    label: 'Password',
    showLabel: false,
    allowUpdate: false,
    placeholder: 'password',
    defaultValue: '',
    autoComplete: 'current-password',
    schema: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  }
]