import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../cv-tokens";
import { LuPhone, LuMail } from "react-icons/lu";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  CVName,
  CVContactItem,
  CVSectionHeader,
  CVTimelineEntry,
  CVSkillGroup,
  CVBulletList,
  CVReferenceCard,
  CVSummary,
} from "../cv/atoms";

const ensureProtocol = (url) => /^https?:\/\//.test(url) ? url : `https://${url}`;

export default function SidebarTemplate({ cv }) {
  const { personal, summary, skills, languages, experience, education, workHistory, references, customSections, sectionOrder, hiddenSections } = cv;

  const renderMainSection = (section) => {
    switch (section.type) {
      case "experience":
        return experience?.length > 0 ? (
          <div key="experience" className="mb-6">
            <CVSectionHeader title="Experience" variant="main" />
            {experience.map((exp, i) => (
              <CVTimelineEntry key={i} years={exp.years} primary={exp.title} secondary={exp.company} description={exp.description} bullets={exp.bullets} variant="main" layout="inline" />
            ))}
          </div>
        ) : null;

      case "education":
        return education?.length > 0 ? (
          <div key="education" className="mb-6">
            <CVSectionHeader title="Education" variant="main" />
            {education.map((edu, i) => (
              <CVTimelineEntry key={i} years={edu.years} primary={edu.degree} secondary={edu.institution} description={edu.description} bullets={edu.bullets} variant="main" layout="inline" />
            ))}
          </div>
        ) : null;

      case "workHistory":
        return workHistory?.length > 0 ? (
          <div key="workHistory" className="mb-6">
            <CVSectionHeader title="Work History" variant="main" />
            {workHistory.map((job, i) => (
              <CVTimelineEntry key={i} years={job.years} primary={job.title} secondary={job.organization} description={job.description} bullets={job.bullets} variant="main" layout="inline" />
            ))}
          </div>
        ) : null;

      case "references":
        return references?.length > 0 ? (
          <div key="references" className="mb-6">
            <CVSectionHeader title="References" variant="main" />
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref, i) => (
                <CVReferenceCard key={i} name={ref.name} title={ref.title} organization={ref.organization} phone={ref.phone} email={ref.email} />
              ))}
            </div>
          </div>
        ) : null;

      case "custom": {
        const cs = customSections?.[section.id];
        if (!cs || !cs.items?.length) return null;
        return (
          <div key={section.id} className="mb-6">
            <CVSectionHeader title={cs.title} variant="main" />
            {cs.items.map((item, i) => (
              <CVTimelineEntry key={i} years={item.years} primary={item.title} secondary={item.subtitle} description={item.description} bullets={item.bullets} variant="main" layout="inline" />
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 print:my-0 bg-white shadow-lg print:shadow-none">
      <div className="flex min-h-[1100px] print:min-h-0">

        {/* Left Sidebar */}
        <div className="w-56 text-white p-6 flex-shrink-0" style={{ backgroundColor: cssColor(cvTokens.colors.sidebarBg) }}>
          <div className="mb-6">
            <CVName name={personal.name} variant="sidebar" />
          </div>

          {/* Contact */}
          {!hiddenSections?.personal && (
            <div className="mb-6 space-y-2">
              <CVContactItem icon={LuPhone} text={personal.phone} variant="sidebar" />
              <CVContactItem icon={LuMail} text={personal.email} href="mail" variant="sidebar" />
              <CVContactItem icon={FaGithub} text={personal.github ? personal.github.replace(/^https?:\/\//, "") : ""} href={personal.github} variant="sidebar" />
              <CVContactItem icon={FaLinkedin} text={personal.linkedin ? personal.linkedin.replace(/^https?:\/\//, "") : ""} href={personal.linkedin} variant="sidebar" />
            </div>
          )}

          {/* Skills */}
          {!hiddenSections?.skills && skills?.length > 0 && (
            <div className="mb-6">
              <CVSectionHeader title="Skills" variant="sidebar" />
              {skills.map((group, i) => (
                <CVSkillGroup key={i} label={group.label} items={group.items} variant="sidebar" format="bullets" />
              ))}
            </div>
          )}

          {/* Languages */}
          {!hiddenSections?.languages && languages?.length > 0 && (
            <div>
              <CVSectionHeader title="Languages" variant="sidebar" />
              <CVBulletList items={languages} variant="sidebar" />
            </div>
          )}
        </div>

        {/* Right Main Content */}
        <div className="flex-1 p-8">
          {!hiddenSections?.summary && summary && (
            <div className="mb-6">
              <CVSummary text={summary} />
            </div>
          )}
          {sectionOrder.filter((s) => !hiddenSections?.[s.id]).map((section) => renderMainSection(section))}
        </div>
      </div>
    </div>
  );
}
