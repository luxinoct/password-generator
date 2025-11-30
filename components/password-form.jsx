"use client";

import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { FieldCheckbox } from "@/components/field-checkbox";
import { FieldInput } from "@/components/field-input";

export function PasswordForm({ form, onSubmit, onCopySingle, onCopyAll }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Password Generator</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="rhf-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="grid grid-cols-2">
              <FieldInput
                name="length"
                control={form.control}
                title="Password Length"
              />

              <FieldInput
                name="quantity"
                control={form.control}
                title="Quantity"
              />
            </FieldGroup>

            <FieldCheckbox
              title="Options"
              name="options"
              control={form.control}
            />
          </FieldSet>
        </form>
      </CardContent>

      {/* Action button group */}
      <CardFooter>
        <Field className="grid grid-cols-3 *:cursor-pointer">
          <Button type="submit" form="rhf-password-form">
            Submit
          </Button>
          <Button variant="outline" type="button" onClick={onCopySingle}>
            Copy
          </Button>
          <Button variant="outline" type="button" onClick={onCopyAll}>
            Copy All
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
