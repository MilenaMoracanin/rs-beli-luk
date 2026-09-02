"use client";

import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  label: string;
  pendingLabel: string;
  className?: string;
  pending?: boolean;
};

export function FormSubmitButton({
  label,
  pendingLabel,
  className,
  pending: pendingOverride,
}: FormSubmitButtonProps) {
  const { pending: formPending } = useFormStatus();
  const pending = pendingOverride ?? formPending;

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}
