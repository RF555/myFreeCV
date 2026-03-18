import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

function BulletList({ bullets, onChange }) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (v) { onChange([...(bullets || []), v]); setInput(""); }
  };

  const remove = (i) => onChange((bullets || []).filter((_, idx) => idx !== i));

  return (
    <div>
      <Label className="text-xs">Bullet Points</Label>
      <div className="flex gap-2 mb-2 mt-1">
        <Input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a bullet point..." className="h-8 text-sm" />
        <Button size="sm" variant="outline" onClick={add} className="h-8"><Plus className="w-3 h-3" /></Button>
      </div>
      <div className="space-y-1">
        {(bullets || []).map((b, i) => (
          <div key={i} className="flex items-start gap-2 bg-gray-50 rounded px-2 py-1">
            <span className="text-xs flex-1">• {b}</span>
            <Trash2 className="w-3 h-3 text-red-400 cursor-pointer flex-shrink-0 mt-0.5" onClick={() => remove(i)} />
          </div>
        ))}
      </div>
    </div>
  );
}

const empty = { years: "", title: "", company: "", bullets: [] };

export default function ExperienceSection({ data, onChange }) {
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

  const remove = (i) => {
    onChange((data || []).filter((_, idx) => idx !== i));
    setOpen(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="w-4 h-4" /> Experience
          </CardTitle>
          <Button size="sm" variant="outline" onClick={add} className="gap-1 h-8">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {(data || []).length === 0 && <p className="text-sm text-gray-400 text-center py-2">No experience added yet.</p>}
        {(data || []).map((exp, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div>
                <span className="font-medium text-sm">{exp.title || "New Experience"}</span>
                {exp.company && <span className="text-xs text-gray-500 ml-2">@ {exp.company}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); remove(i); }} />
                {open === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
            {open === i && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Years (e.g. 2024 – Present)</Label>
                    <Input value={exp.years} onChange={(e) => update(i, "years", e.target.value)} className="h-8 text-sm mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Job Title</Label>
                    <Input value={exp.title} onChange={(e) => update(i, "title", e.target.value)} className="h-8 text-sm mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Company</Label>
                    <Input value={exp.company} onChange={(e) => update(i, "company", e.target.value)} className="h-8 text-sm mt-1" />
                  </div>
                </div>
                <BulletList bullets={exp.bullets} onChange={(v) => update(i, "bullets", v)} />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}