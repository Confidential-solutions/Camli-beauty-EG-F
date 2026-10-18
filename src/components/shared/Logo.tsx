import { brandMedia } from "@/data/brand";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <>
      <img src={brandMedia.logoDark} alt="Camli" className={cn("w-auto dark:hidden", className)} />
      <img src={brandMedia.logoLight} alt="Camli" className={cn("hidden w-auto dark:block", className)} />
    </>
  );
}
