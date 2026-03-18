import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const empty = { years: "", degree: "", institution: "" };

export default function EducationSection({ data, onChange }) {
  const [open, setOpen] = useState(null);

  const add = () => {
    const updated = [...(data || []), { ...empty }];
    onChange(updated);
    setOpen(updated.length - 1);
  };

  const update = (i, field, val) => {
    const updated = [...(data || [])];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };

  const remove = (i) => { onChange((data || []).filter((_, idx) => idx !== i)); setOpen(null); };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="w-4 h-4" /> Education
          </CardTitle>
          <Button size="sm" variant="outline" onClick={add} className="gap-1 h-8">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {(data || []).length === 0 && <p className="text-sm text-gray-400 text-center py-2">No education added yet.</p>}
        {(data || []).map((edu, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div>
                <span className="font-medium text-sm">{edu.degree || "New Education"}</span>
                {edu.institution && <span className="text-xs text-gray-500 ml-2">@ {edu.institution}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); remove(i); }} />
                {open === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
            {open === i && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Years (e.g. 2020 – 2024)</Label>
                  <Input value={edu.years} onChange={(e) => update(i, "years", e.target.value)} className="h-8 text-sm mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Degree / Title</Label>
                  <Input value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} className="h-8 text-sm mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Institution</Label>
                  <Input value={edu.institution} onChange={(e) => update(i, "institution", e.target.value)} className="h-8 text-sm mt-1" />
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}