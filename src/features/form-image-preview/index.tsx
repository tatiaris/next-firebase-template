import React from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

/**
 * Form Image Preview component
 */

export function FormImagePreview({ form, field }: { form: UseFormReturn, field: string }) {
  const image = useWatch({
    control: form.control,
    name: field as never,
  });
  if (!image) return <></>;
  return (
    <div id="image-preview">
      <img
        src={((image as any) instanceof File) ? URL.createObjectURL(image) : image}
        alt="preview"
        className="h-32 object-cover rounded-lg shadow-md"
      />
    </div>
  );
};

export function FormMultiImagePreview({ form, field }: { form: UseFormReturn, field: string }) {
  const images: FileList = useWatch({
    control: form.control,
    name: field as never,
  });
  if (!images) return <></>;
  return (
    <div id="images-preview" className="flex gap-2">
      {Array.from(images).map((image, i) => (
        <img
          key={`image-preview-${i}`}
          src={URL.createObjectURL(image)}
          alt="preview"
          className="h-32 object-cover rounded-lg shadow-md"
        />
      ))}
    </div>
  );
}