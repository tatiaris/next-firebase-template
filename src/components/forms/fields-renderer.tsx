import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { FIELD, FieldObject, FORM_TYPE } from "./utils";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { cn } from "@lib/utils";

/**
 * FieldsRenderer component
 */

type FieldsRendererProps = {
  form: UseFormReturn<any>,
  fields: FieldObject[],
  formType?: FORM_TYPE
};

const FieldsRenderer = ({ form, fields, formType = FORM_TYPE.CREATE }: FieldsRendererProps) =>
  fields.map((f, i) => {
    if (formType === FORM_TYPE.UPDATE && !f.allowUpdate) return <></>;
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
    case FIELD.SELECT:
      return (
        <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="w-[180px]" aria-label={fieldMetadata.placeholder}>
              <SelectValue placeholder={fieldMetadata.placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {fieldMetadata.options?.map((option, i) => (
              <SelectItem key={`${fieldMetadata.name}-option-${i}`} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case FIELD.IMAGE:
      return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <input
            type="file"
            className={cn("cursor-pointer flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50")}
            name={field.name}
            onChange={e => field.onChange(e.target.files?.[0] as File)}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        </div>
      )
    default:
      break;
  }
}

export { FieldsRenderer };