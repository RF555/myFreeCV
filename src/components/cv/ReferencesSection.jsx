import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuUsers, LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import ItemModal from "./ItemModal";

const SCHEMA = [
  { key: "name", label: "Full Name", type: "text", placeholder: "John Smith" },
  { key: "title", label: "Title / Relationship", type: "text", placeholder: "Senior Manager" },
  { key: "organization", label: "Organization", type: "text", placeholder: "Company Name" },
  { key: "phone", label: "Phone (optional)", type: "text", placeholder: "+1-555-1234" },
  { key: "email", label: "Email (optional)", type: "text", placeholder: "john@example.com" },
];

export default function ReferencesSection({ data, onChange }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const openAdd = () => { setEditingIndex(null); setModalOpen(true); };
  const openEdit = (i) => { setEditingIndex(i); setModalOpen(true); };

  const handleSave = (item) => {
    if (editingIndex === null) {
      onChange([...(data || []), item]);
    } else {
      const updated = [...(data || [])];
      updated[editingIndex] = item;
      onChange(updated);
    }
  };

  const remove = (i) => onChange((data || []).filter((_, idx) => idx !== i));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <LuUsers className="w-4 h-4" /> References
          </CardTitle>
          <Button size="sm" variant="outline" onClick={openAdd} className="gap-1 h-8">
            <LuPlus className="w-3 h-3" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {(data || []).length === 0 && <p className="text-sm text-gray-400 text-center py-2">No references added yet.</p>}
        {(data || []).map((ref, i) => (
          <div key={i} className="border rounded-lg px-4 py-3 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{ref.name || "Untitled"}</p>
                <p className="text-xs text-gray-500">{[ref.title, ref.organization].filter(Boolean).join(" · ")}</p>
                {(ref.phone || ref.email) && (
                  <p className="text-xs text-gray-400 mt-1">{[ref.phone, ref.email].filter(Boolean).join(" · ")}</p>
                )}
              </div>
              <div className="flex gap-1 ml-2 flex-shrink-0">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(i)}><LuPencil className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => remove(i)}><LuTrash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <ItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        schema={SCHEMA}
        initialData={editingIndex !== null ? (data || [])[editingIndex] : null}
        title={editingIndex !== null ? "Edit Reference" : "Add Reference"}
      />
    </Card>
  );
}
