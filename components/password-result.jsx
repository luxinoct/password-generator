"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

function PasswordItem({ item, highlighted }) {
  return <p className={highlighted ? "bg-accent" : ""}>{item}</p>;
}

export function PasswordResult({ displayRef, passwords = [], copiedIndex }) {
  return (
    <Card className="h-[50vh] md:h-[80vh]">
      <CardContent className="h-full">
        <ScrollArea className="h-full flex-1 overflow-auto border rounded-md p-2">
          <div className="space-y-1" ref={displayRef}>
            {passwords.map((item, index) => (
              <PasswordItem
                key={index}
                item={item}
                highlighted={copiedIndex === "all" || copiedIndex === index}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
