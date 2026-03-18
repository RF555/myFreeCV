import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LuPlus, LuTrash2, LuChevronUp, LuChevronDown } from "react-icons/lu";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i);

export function formatYearRange(yr) {
  if (!yr) return "";
  if (typeof yr === "string") return yr; // legacy string data
  const from = yr.from || "";
  const to = yr.to === "Present" ? "Present" : yr.to || "";
  if (!from && !to) return "";
  if (from && !to) return String(from);
  if (!from && to) return String(to);
  return `${from} – ${to}`;
}

function YearRangeEditor({ value, onChange }) {
  const yr = value || { from: null, to: null };

  return (
    <div className="flex items-center gap-2 mt-1">
      <Select
        value={yr.from ? String(yr.from) : ""}
        onValueChange={(v) => onChange({ ...yr, from: Number(v) })}
      >
        <SelectTrigger className="flex-1 h-9 text-sm">
          <SelectValue placeholder="From" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-gray-400 text-sm">–</span>
      <Select
        value={yr.to ? String(yr.to) : ""}
        onValueChange={(v) => onChange({ ...yr, to: v === "Present" ? "Present" : Number(v) })}
      >
        <SelectTrigger className="flex-1 h-9 text-sm">
          <SelectValue placeholder="To" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Present">Present</SelectItem>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function BulletEditor({ bullets, onChange }) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (v) { onChange([...(bullets || []), v]); setInput(""); }
  };

  const remove = (i) => onChange((bullets || []).filter((_, idx) => idx !== i));

  const edit = (i, val) => {
    const updated = [...(bullets || [])];
    updated[i] = val;
    onChange(updated);
  };

  const move = (i, dir) => {
    const j = i + dir;
    const list = [...(bullets || [])];
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    onChange(list);
  };

  return (
    <div>
      <Label className="text-xs font-semibold">Bullet Points</Label>
      <div className="flex gap-2 mt-1 mb-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Type a bullet point and press Enter..." className="h-8 text-sm" />
        <Button size="sm" variant="outline" onClick={add} className="h-8 px-2"><LuPlus className="w-3 h-3" /></Button>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {(bullets || []).map((b, i) => (
          <div key={i} className="flex items-start gap-1">
            <div className="flex flex-col">
              <Button size="sm" variant="ghost" className="h-3.5 w-5 p-0" onClick={() => move(i, -1)} disabled={i === 0}>
                <LuChevronUp className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-3.5 w-5 p-0" onClick={() => move(i, 1)} disabled={i === (bullets || []).length - 1}>
                <LuChevronDown className="w-3 h-3" />
              </Button>
            </div>
            <Input value={b} onChange={(e) => edit(i, e.target.value)} className="h-7 text-xs flex-1" />
            <Button size="sm" variant="ghost" className="h-7 px-1 text-red-400 hover:text-red-600" onClick={() => remove(i)}>
              <LuTrash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Schema: array of { key, label, type: 'text'|'textarea'|'bullets'|'yearRange' }
export default function ItemModal({ open, onClose, onSave, schema, initialData, title }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (open) {
      const init = {};
      schema.forEach(f => {
        const defaultVal = f.type === "bullets" ? [] : f.type === "yearRange" ? { from: null, to: null } : "";
        init[f.key] = initialData?.[f.key] ?? defaultVal;
      });
      setForm(init);
    }
  }, [open, initialData]);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {schema.map(field => (
            <div key={field.key}>
              <Label className="text-sm font-medium">{field.label}</Label>
              {field.type === "text" && (
                <Input value={form[field.key] || ""} onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder || ""} className="mt-1" />
              )}
              {field.type === "textarea" && (
                <Textarea value={form[field.key] || ""} onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder || ""} rows={3} className="mt-1" />
              )}
              {field.type === "yearRange" && (
                <YearRangeEditor value={form[field.key]} onChange={(v) => update(field.key, v)} />
              )}
              {field.type === "bullets" && (
                <div className="mt-1">
                  <BulletEditor bullets={form[field.key] || []} onChange={(v) => update(field.key, v)} />
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
