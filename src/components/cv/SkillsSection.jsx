import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuCode, LuPlus, LuX, LuTrash2 } from "react-icons/lu";

function SkillGroup({ group, onAddSkill, onRemoveSkill, onRemoveGroup, onRenameGroup }) {
  const [skillInput, setSkillInput] = useState("");
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelInput, setLabelInput] = useState(group.label);

  const handleAddSkill = () => {
    const val = skillInput.trim();
    if (val) { onAddSkill(val); setSkillInput(""); }
  };

  const handleRename = () => {
    if (labelInput.trim()) onRenameGroup(labelInput.trim());
    setEditingLabel(false);
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        {editingLabel ? (
          <Input
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="h-7 text-sm font-semibold flex-1 mr-2"
            autoFocus
          />
        ) : (
          <p
            className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
            onClick={() => setEditingLabel(true)}
            title="Click to rename"
          >
            {group.label}
          </p>
        )}
        <LuTrash2 className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600 flex-shrink-0" onClick={onRemoveGroup} />
      </div>
      <div className="flex gap-2 mb-2">
        <Input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          placeholder="Add skill..."
          className="h-7 text-sm"
        />
        <Button size="sm" variant="outline" onClick={handleAddSkill} className="h-7 px-2">
          <LuPlus className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(group.items || []).map((s, i) => (
          <Badge key={i} variant="secondary" className="gap-1 text-xs">
            {s}
            <LuX className="w-3 h-3 cursor-pointer" onClick={() => onRemoveSkill(i)} />
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection({ data, onChange }) {
  // data is an array of { label, items }
  const groups = Array.isArray(data) ? data : [];
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const openAddModal = () => { setNewCategoryName(""); setAddModalOpen(true); };

  const addGroup = () => {
    const name = newCategoryName.trim();
    if (name) {
      onChange([...groups, { label: name, items: [] }]);
      setAddModalOpen(false);
    }
  };

  const updateGroup = (i, updated) => {
    const g = [...groups];
    g[i] = updated;
    onChange(g);
  };

  const removeGroup = (i) => onChange(groups.filter((_, idx) => idx !== i));

  const addSkill = (i, skill) => updateGroup(i, { ...groups[i], items: [...(groups[i].items || []), skill] });
  const removeSkill = (i, si) => updateGroup(i, { ...groups[i], items: groups[i].items.filter((_, idx) => idx !== si) });
  const renameGroup = (i, label) => updateGroup(i, { ...groups[i], label });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <LuCode className="w-4 h-4" /> Skills
          </CardTitle>
          <Button size="sm" variant="outline" onClick={openAddModal} className="gap-1 h-8">
            <LuPlus className="w-3 h-3" /> Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {groups.length === 0 && <p className="text-sm text-gray-400 col-span-2 text-center py-2">No skill categories yet. Add one!</p>}
        {groups.map((group, i) => (
          <SkillGroup
            key={i}
            group={group}
            onAddSkill={(v) => addSkill(i, v)}
            onRemoveSkill={(si) => removeSkill(i, si)}
            onRemoveGroup={() => removeGroup(i)}
            onRenameGroup={(label) => renameGroup(i, label)}
          />
        ))}
      </CardContent>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Skill Category</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-sm font-medium">Category Name</Label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGroup()}
              placeholder="e.g. Programming Languages"
              className="mt-1"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={addGroup} disabled={!newCategoryName.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}