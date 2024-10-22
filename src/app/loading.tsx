"use client";
import LoadingUI from "@components/ui/loading";
import { ThemeProvider } from "@hooks/useTheme";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <ThemeProvider>
      <div className="py-4 px-4">
        <LoadingUI />
      </div>
    </ThemeProvider>
  );
}
