import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuUser, LuPhone, LuMail } from "react-icons/lu";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function PersonalInfoSection({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <LuUser className="w-4 h-4" /> Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label>Full Name</Label>
          <Input placeholder="John Doe" value={data.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5"><LuPhone className="w-3.5 h-3.5" /> Phone</Label>
          <Input placeholder="+1 (555) 123-4567" value={data.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5"><LuMail className="w-3.5 h-3.5" /> Email</Label>
          <Input placeholder="john.doe@email.com" value={data.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5"><FaGithub className="w-3.5 h-3.5" /> GitHub URL</Label>
          <Input placeholder="https://github.com/username" value={data.github} onChange={(e) => update("github", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5"><FaLinkedin className="w-3.5 h-3.5" /> LinkedIn URL</Label>
          <Input placeholder="https://linkedin.com/in/username" value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}