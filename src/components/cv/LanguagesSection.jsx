import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuGlobe, LuPlus, LuX } from "react-icons/lu";

export default function LanguagesSection({ data, onChange }) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val) { onChange([...(data || []), val]); setInput(""); }
  };

  const remove = (i) => onChange((data || []).filter((_, idx) => idx !== i));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <LuGlobe className="w-4 h-4" /> Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a language..."
            className="h-8 text-sm"
          />
          <Button size="sm" variant="outline" onClick={add} className="h-8">
            <LuPlus className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {(data || []).map((l, i) => (
            <Badge key={i} variant="secondary" className="gap-1">
              {l}
              <LuX className="w-3 h-3 cursor-pointer" onClick={() => remove(i)} />
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}