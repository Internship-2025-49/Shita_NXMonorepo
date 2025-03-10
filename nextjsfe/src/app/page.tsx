"use client"; 

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import * as React from "react"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/User"); 
  }, [router]);

  const [progress, setProgress] = React.useState(13)
 
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(30), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex justify-center items-center h-screen">
      <Progress value={progress} className="w-[90%]" />
    </div>
  );
}
