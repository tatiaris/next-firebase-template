import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { FIELD, FieldObject } from "./utils";
import { Textarea } from "@components/ui/textarea";

/**
 * FieldsRenderer component
 */
type FieldsRendererProps = {
  form: UseFormReturn<any>,
  fields: FieldObject[]
}
const FieldsRenderer = ({ form, fields }: FieldsRendererProps) =>
  fields.map((f, i) => {
    return (
      <FormField
        key={`${f.name}-field-${i}`}
        control={form.control}
        name={f.name as never}
        render={({ field }) => (
          <FormItem>
            {f.showLabel && <FormLabel htmlFor={f.name}>{f.label}</FormLabel>}
            <FormControl>
              <FieldRender field={field} fieldMetadata={f} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  });

type FieldRenderProps = {
  fieldMetadata: FieldObject;
  field: ControllerRenderProps<any>;
}
const FieldRender = ({ fieldMetadata, field }: FieldRenderProps) => {
  switch (fieldMetadata.type) {
    case FIELD.INPUT:
      return (
        <Input
          id={fieldMetadata.name}
          placeholder={fieldMetadata.placeholder}
          autoComplete={fieldMetadata.autoComplete && fieldMetadata.autoComplete?.length > 0 ? fieldMetadata.autoComplete : undefined}
          {...field}
        />
      )
    case FIELD.TEXTAREA:
      return (
        <Textarea
          id={fieldMetadata.name}
          placeholder={fieldMetadata.placeholder}
          {...field}
        />
      )
    default:
      break;
  }
}

export { FieldsRenderer };