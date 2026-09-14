import { Suspense } from "react";
import VerifyPhoneForm from "@/components/VerifyPhoneForm";

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={null}>
      <VerifyPhoneForm />
    </Suspense>
  );
}
