import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Plus, X } from "lucide-react";

function SkillGroup({ label, items, onAdd, onRemove }) {
  const [input, setInput] = React.useState("");

  const handleAdd = () => {
    const val = input.trim();
    if (val) { onAdd(val); setInput(""); }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add skill..."
          className="h-8 text-sm"
        />
        <Button size="sm" variant="outline" onClick={handleAdd} className="h-8">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((s, i) => (
          <Badge key={i} variant="secondary" className="gap-1">
            {s}
            <X className="w-3 h-3 cursor-pointer" onClick={() => onRemove(i)} />
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection({ data, onChange }) {
  const updateGroup = (group, val) => onChange({ ...data, [group]: val });

  const addSkill = (group, skill) =>
    updateGroup(group, [...(data[group] || []), skill]);

  const removeSkill = (group, idx) =>
    updateGroup(group, (data[group] || []).filter((_, i) => i !== idx));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Code className="w-4 h-4" /> Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillGroup
          label="Programming Languages & Frameworks"
          items={data.programmingLanguages || []}
          onAdd={(v) => addSkill("programmingLanguages", v)}
          onRemove={(i) => removeSkill("programmingLanguages", i)}
        />
        <SkillGroup
          label="Databases"
          items={data.databases || []}
          onAdd={(v) => addSkill("databases", v)}
          onRemove={(i) => removeSkill("databases", i)}
        />
        <SkillGroup
          label="AI/ML & Algorithms"
          items={data.aiml || []}
          onAdd={(v) => addSkill("aiml", v)}
          onRemove={(i) => removeSkill("aiml", i)}
        />
        <SkillGroup
          label="Software Architecture"
          items={data.softwareArchitecture || []}
          onAdd={(v) => addSkill("softwareArchitecture", v)}
          onRemove={(i) => removeSkill("softwareArchitecture", i)}
        />
      </CardContent>
    </Card>
  );
}