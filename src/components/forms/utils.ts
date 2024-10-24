import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export enum FIELD {
  INPUT = "input",
  TEXTAREA = "textarea"
}

export type FieldObject = {
  name: string;
  type: FIELD;
  label: string;
  showLabel: boolean;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  schema: z.ZodString;
}

export const buildForm = (fields) => {
  const schema = buildSchema(fields);
  const defaultValues = buildDefaultValues(fields);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  return { form, schema }
}

export const resetForm = (form, fields, keepDefaultValues = false) => {
  const values = keepDefaultValues ? buildDefaultValues(fields) : buildEmptyValues(fields);
  form.reset(
    values,
    {
      keepValues: false,
      keepDefaultValues,
    }
  )
}

const buildSchema = (fields) => {
  const formObject = {};
  fields.forEach(f => {
    formObject[f.name] = f.schema;
  })
  return z.object(formObject);
}

const buildDefaultValues = (fields) => {
  const defaultValues = {};
  fields.forEach(f => {
    defaultValues[f.name] = f.defaultValue;
  })
  return defaultValues;
}

const buildEmptyValues = (fields) => {
  const defaultValues = {};
  fields.forEach(f => {
    defaultValues[f.name] = '';
  })
  return defaultValues;
}