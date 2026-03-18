import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

export default function SummarySection({ data, onChange }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-4 h-4" /> Professional Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          rows={4}
          placeholder="Briefly describe your professional background and goals..."
          value={data}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}