import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LuLayoutTemplate, LuPlus, LuPencil, LuTrash2, LuSettings2 } from "react-icons/lu";
import ItemModal, { formatYearRange } from "./ItemModal";

const DEFAULT_SCHEMA = [
  { key: "title", label: "Title / Role", type: "text", placeholder: "e.g. Project Name or Position" },
  { key: "subtitle", label: "Subtitle (optional)", type: "text", placeholder: "e.g. Organization or Tech Stack" },
  { key: "years", label: "Years", type: "yearRange" },
  { key: "description", label: "Description (optional)", type: "textarea" },
  { key: "bullets", label: "Bullet Points", type: "bullets" },
];

function FieldConfigurator({ schema, onChange, open, onClose }) {
  const [fields, setFields] = useState(schema);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("text");

  const handleOpen = () => {
    setFields(schema);
    setNewLabel("");
    setNewType("text");
  };

  const addField = () => {
    const label = newLabel.trim();
    if (!label) return;
    const key = `field_${Date.now()}`;
    setFields([...fields, { key, label, type: newType, placeholder: "" }]);
    setNewLabel("");
    setNewType("text");
  };

  const removeField = (i) => setFields(fields.filter((_, idx) => idx !== i));

  const updateField = (i, updates) => {
    const updated = [...fields];
    updated[i] = { ...updated[i], ...updates };
    setFields(updated);
  };

  const moveField = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= fields.length) return;
    const updated = [...fields];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    setFields(updated);
  };

  const handleSave = () => {
    onChange(fields);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (v) handleOpen(); else onClose(); }}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Fields</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-gray-500">Customize which fields appear when adding items to this section.</p>

          {fields.map((field, i) => (
            <div key={field.key} className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
              <div className="flex flex-col gap-0.5 mr-1">
                <button onClick={() => moveField(i, -1)} disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none">▲</button>
                <button onClick={() => moveField(i, 1)} disabled={i === fields.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={field.label}
                  onChange={(e) => updateField(i, { label: e.target.value })}
                  className="h-7 text-sm"
                  placeholder="Field label"
                />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{field.type}</span>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => removeField(i)}>
                <LuTrash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}

          <div className="border-t pt-3 space-y-2">
            <Label className="text-xs font-semibold">Add New Field</Label>
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addField()}
                placeholder="Field label"
                className="h-8 text-sm flex-1"
              />
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className="h-8 w-28 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="yearRange">Year Range</SelectItem>
                  <SelectItem value="bullets">Bullets</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={addField} className="h-8 px-2" disabled={!newLabel.trim()}>
                <LuPlus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CustomSection({ section, onChange, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(section.title);
  const [configOpen, setConfigOpen] = useState(false);

  const schema = section.schema || DEFAULT_SCHEMA;

  const openAdd = () => { setEditingIndex(null); setModalOpen(true); };
  const openEdit = (i) => { setEditingIndex(i); setModalOpen(true); };

  const handleSave = (item) => {
    if (editingIndex === null) {
      onChange({ ...section, items: [...(section.items || []), item] });
    } else {
      const items = [...(section.items || [])];
      items[editingIndex] = item;
      onChange({ ...section, items });
    }
  };

  const remove = (i) => onChange({ ...section, items: (section.items || []).filter((_, idx) => idx !== i) });

  const saveTitle = () => {
    if (titleInput.trim()) onChange({ ...section, title: titleInput.trim() });
    setEditingTitle(false);
  };

  const updateSchema = (newSchema) => {
    onChange({ ...section, schema: newSchema });
  };

  // Find the best display fields from the schema
  const titleKey = schema[0]?.key;
  const subtitleKey = schema.length > 1 ? schema[1]?.key : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <LuLayoutTemplate className="w-4 h-4 flex-shrink-0" />
            {editingTitle ? (
              <Input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                className="h-7 text-sm font-semibold"
                autoFocus
              />
            ) : (
              <span
                className="font-semibold text-base cursor-pointer hover:text-blue-600"
                onClick={() => setEditingTitle(true)}
                title="Click to rename section"
              >
                {section.title}
              </span>
            )}
          </div>
          <div className="flex gap-2 ml-2">
            <Button size="sm" variant="ghost" onClick={() => setConfigOpen(true)} className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600" title="Configure fields">
              <LuSettings2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openAdd} className="gap-1 h-8">
              <LuPlus className="w-3 h-3" /> Add
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={onDelete}>
              <LuTrash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {(section.items || []).length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">No items yet. Click Add to get started.</p>
        )}
        {(section.items || []).map((item, i) => (
          <div key={i} className="border rounded-lg px-4 py-3 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {schema.filter(f => f.type !== "bullets").map((field) => {
                  const val = item[field.key];
                  if (!val) return null;
                  if (field.type === "yearRange") {
                    const formatted = formatYearRange(val);
                    return formatted ? <p key={field.key} className="text-xs text-gray-500">{formatted}</p> : null;
                  }
                  if (field === schema[0]) {
                    return <p key={field.key} className="font-medium text-sm">{val}</p>;
                  }
                  return <p key={field.key} className="text-xs text-gray-500">{val}</p>;
                })}
                {!item[schema[0]?.key] && <p className="font-medium text-sm text-gray-400">Untitled</p>}
              </div>
              <div className="flex gap-1 ml-2 flex-shrink-0">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(i)}><LuPencil className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => remove(i)}><LuTrash2 className="w-3 h-3" /></Button>
              </div>
            </div>
            {schema.filter(f => f.type === "bullets").map((field) => {
              const bullets = item[field.key];
              if (!bullets?.length) return null;
              return (
                <ul key={field.key} className="mt-2 space-y-0.5">
                  {bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                      <span className="text-gray-400">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        ))}
      </CardContent>

      <ItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        schema={schema}
        initialData={editingIndex !== null ? (section.items || [])[editingIndex] : null}
        title={editingIndex !== null ? `Edit ${section.title} Item` : `Add to ${section.title}`}
      />

      <FieldConfigurator
        schema={schema}
        onChange={updateSchema}
        open={configOpen}
        onClose={() => setConfigOpen(false)}
      />
    </Card>
  );
}
