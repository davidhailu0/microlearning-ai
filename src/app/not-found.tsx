import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Compass className="size-6" />
      </span>
      <h1 className="mt-5 text-xl font-semibold tracking-tight">
        That lesson isn&apos;t here
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        The link may be from an earlier session. In demo mode, data resets when the
        server restarts.
      </p>
      <Button asChild className="mt-5">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to Today
        </Link>
      </Button>
    </div>
  );
}
