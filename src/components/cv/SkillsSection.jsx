import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuCode, LuPlus, LuX, LuTrash2, LuGripVertical } from "react-icons/lu";

function SkillBadge({ skill, index, onRemove, onRename }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(skill);

  const handleSave = () => {
    const val = editValue.trim();
    if (val && val !== skill) onRename(val);
    else setEditValue(skill);
    setEditing(false);
  };

  return (
    <Draggable draggableId={`skill-${index}-${skill}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="inline-block"
        >
          {editing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="h-6 text-xs w-24"
              autoFocus
            />
          ) : (
            <Badge
              variant="secondary"
              className={`gap-1 text-xs cursor-grab active:cursor-grabbing select-none ${
                snapshot.isDragging ? "opacity-80 shadow-lg ring-2 ring-blue-300" : ""
              }`}
              onDoubleClick={() => { setEditValue(skill); setEditing(true); }}
              title="Drag to reorder · Double-click to edit"
            >
              {skill}
              <LuX className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); onRemove(); }} />
            </Badge>
          )}
        </div>
      )}
    </Draggable>
  );
}

function SkillGroup({ group, groupIndex, onAddSkill, onRemoveSkill, onRenameSkill, onRemoveGroup, onRenameGroup, dragHandleProps }) {
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
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 flex-shrink-0"
          >
            <LuGripVertical className="w-4 h-4" />
          </div>
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
        </div>
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
      <Droppable droppableId={`skills-${groupIndex}`} type="SKILL" direction="horizontal">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-1 min-h-[28px]">
            {(group.items || []).map((s, i) => (
              <SkillBadge
                key={`${groupIndex}-${i}-${s}`}
                skill={s}
                index={i}
                onRemove={() => onRemoveSkill(i)}
                onRename={(newName) => onRenameSkill(i, newName)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default function SkillsSection({ data, onChange }) {
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
  const renameSkill = (i, si, newName) => {
    const items = [...groups[i].items];
    items[si] = newName;
    updateGroup(i, { ...groups[i], items });
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "CATEGORY") {
      const reordered = [...groups];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      onChange(reordered);
      return;
    }

    if (type === "SKILL") {
      const sourceGroupIndex = parseInt(source.droppableId.replace("skills-", ""), 10);
      const destGroupIndex = parseInt(destination.droppableId.replace("skills-", ""), 10);
      const newGroups = groups.map((g) => ({ ...g, items: [...(g.items || [])] }));

      if (sourceGroupIndex === destGroupIndex) {
        const items = newGroups[sourceGroupIndex].items;
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
      } else {
        const [moved] = newGroups[sourceGroupIndex].items.splice(source.index, 1);
        newGroups[destGroupIndex].items.splice(destination.index, 0, moved);
      }

      onChange(newGroups);
    }
  };

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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="skill-categories" type="CATEGORY">
          {(provided) => (
            <CardContent
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 gap-3"
            >
              {groups.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">No skill categories yet. Add one!</p>
              )}
              {groups.map((group, i) => (
                <Draggable key={`category-${i}`} draggableId={`category-${i}`} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? "opacity-80 shadow-xl" : ""}`}
                    >
                      <SkillGroup
                        group={group}
                        groupIndex={i}
                        onAddSkill={(v) => addSkill(i, v)}
                        onRemoveSkill={(si) => removeSkill(i, si)}
                        onRenameSkill={(si, newName) => renameSkill(i, si, newName)}
                        onRemoveGroup={() => removeGroup(i)}
                        onRenameGroup={(label) => renameGroup(i, label)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CardContent>
          )}
        </Droppable>
      </DragDropContext>

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
