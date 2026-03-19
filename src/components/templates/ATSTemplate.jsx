import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../cv-tokens";
import {
  CVName,
  CVSectionHeader,
  CVTimelineEntry,
  CVSkillGroup,
  CVReferenceCard,
  CVSummary,
} from "../cv/atoms";

const ensureProtocol = (url) => /^https?:\/\//.test(url) ? url : `https://${url}`;

/* ─── Header: name + contact in a subtle background band ─── */
function ATSHeader({ personal, hiddenSections }) {
  const contactParts = [];
  if (personal.phone) contactParts.push({ text: personal.phone });
  if (personal.email) contactParts.push({ text: personal.email, href: `mailto:${personal.email}` });
  if (personal.github) contactParts.push({ text: personal.github.replace(/^https?:\/\//, ""), href: ensureProtocol(personal.github) });
  if (personal.linkedin) contactParts.push({ text: personal.linkedin.replace(/^https?:\/\//, ""), href: ensureProtocol(personal.linkedin) });

  const contactStyle = {
    fontFamily: cvTokens.fonts.primary,
    fontSize: ptToRem(cvTokens.fontSize.contact),
    color: cssColor(cvTokens.colors.mainSecondary),
    letterSpacing: "0.01em",
  };

  return (
    <div
      className="px-12 pt-10 pb-8 print:px-8 print:pt-8 print:pb-6"
      style={{ backgroundColor: cssColor(cvTokens.colors.atsHeaderBg) }}
    >
      {/* Name — large, tracked, centered */}
      <h1
        className="text-center mb-3"
        style={{
          fontFamily: cvTokens.fonts.heading,
          fontSize: ptToRem(cvTokens.fontSize.atsName),
          fontWeight: 700,
          color: cssColor(cvTokens.colors.mainHeading),
          letterSpacing: "0.06em",
          lineHeight: 1.1,
        }}
      >
        {(personal.name || "Your Name").toUpperCase()}
      </h1>

      {/* Contact — middle-dot separated, centered */}
      {!hiddenSections?.personal && contactParts.length > 0 && (
        <p className="text-center" style={contactStyle}>
          {contactParts.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span
                  className="mx-2.5 inline-block"
                  style={{ color: cssColor(cvTokens.colors.atsDivider), fontSize: "0.6em", verticalAlign: "middle" }}
                >
                  &#9670;
                </span>
              )}
              {p.href ? (
                <a href={p.href} target="_blank" rel="noreferrer" style={{ color: cssColor(cvTokens.colors.mainSecondary), textDecoration: "none" }}>
                  {p.text}
                </a>
              ) : (
                <span>{p.text}</span>
              )}
            </React.Fragment>
          ))}
        </p>
      )}
    </div>
  );
}

/* ─── Section divider — thin accent line ─── */
function ATSSectionDivider({ title }) {
  return (
    <div className="mb-4 mt-7 first:mt-0">
      <h2
        className="uppercase tracking-widest pb-2 mb-0"
        style={{
          fontFamily: cvTokens.fonts.heading,
          fontSize: ptToRem(cvTokens.fontSize.sectionHeading),
          fontWeight: 700,
          color: cssColor(cvTokens.colors.atsAccent),
          borderBottom: `1.5px solid ${cssColor(cvTokens.colors.atsAccent)}`,
          letterSpacing: "0.12em",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ─── Skills as inline pills ─── */
function ATSSkillPills({ groups }) {
  return (
    <div className="space-y-3">
      {groups.map((group, i) => (
        <div key={i}>
          <p
            className="mb-1.5"
            style={{
              fontFamily: cvTokens.fonts.primary,
              fontSize: ptToRem(cvTokens.fontSize.small),
              fontWeight: 600,
              color: cssColor(cvTokens.colors.mainHeading),
              letterSpacing: "0.02em",
            }}
          >
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(group.items || []).map((skill, j) => (
              <span
                key={j}
                className="inline-block px-2.5 py-0.5 rounded"
                style={{
                  fontFamily: cvTokens.fonts.primary,
                  fontSize: ptToRem(cvTokens.fontSize.skillPill),
                  color: cssColor(cvTokens.colors.atsSkillText),
                  backgroundColor: cssColor(cvTokens.colors.atsSkillBg),
                  border: `1px solid ${cssColor(cvTokens.colors.atsSkillBorder)}`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main template ─── */
export default function ATSTemplate({ cv }) {
  const { personal, summary, skills, languages, experience, education, workHistory, references, customSections, sectionOrder, hiddenSections } = cv;

  const renderSection = (section) => {
    switch (section.type) {
      case "experience":
        return experience?.length > 0 ? (
          <div key="experience">
            <ATSSectionDivider title="Experience" />
            <div className="space-y-5">
              {experience.map((exp, i) => (
                <CVTimelineEntry key={i} years={exp.years} primary={exp.title} secondary={exp.company} description={exp.description} bullets={exp.bullets} variant="main" layout="stacked" />
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education?.length > 0 ? (
          <div key="education">
            <ATSSectionDivider title="Education" />
            <div className="space-y-5">
              {education.map((edu, i) => (
                <CVTimelineEntry key={i} years={edu.years} primary={edu.degree} secondary={edu.institution} description={edu.description} bullets={edu.bullets} variant="main" layout="stacked" />
              ))}
            </div>
          </div>
        ) : null;

      case "workHistory":
        return workHistory?.length > 0 ? (
          <div key="workHistory">
            <ATSSectionDivider title="Work History" />
            <div className="space-y-5">
              {workHistory.map((job, i) => (
                <CVTimelineEntry key={i} years={job.years} primary={job.title} secondary={job.organization} description={job.description} bullets={job.bullets} variant="main" layout="stacked" />
              ))}
            </div>
          </div>
        ) : null;

      case "references":
        return references?.length > 0 ? (
          <div key="references">
            <ATSSectionDivider title="References" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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
          <div key={section.id}>
            <ATSSectionDivider title={cs.title} />
            <div className="space-y-5">
              {cs.items.map((item, i) => (
                <CVTimelineEntry key={i} years={item.years} primary={item.title} secondary={item.subtitle} description={item.description} bullets={item.bullets} variant="main" layout="stacked" />
              ))}
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const renderOrderedSections = () => {
    const elements = [];

    for (const section of (sectionOrder || [])) {
      if (hiddenSections?.[section.id]) continue;
      elements.push(renderSection(section));
    }

    // Skills
    if (!hiddenSections?.skills && skills?.length > 0) {
      elements.push(
        <div key="skills">
          <ATSSectionDivider title="Skills" />
          <ATSSkillPills groups={skills} />
        </div>
      );
    }

    // Languages
    if (!hiddenSections?.languages && languages?.length > 0) {
      elements.push(
        <div key="languages">
          <ATSSectionDivider title="Languages" />
          <p style={{
            fontFamily: cvTokens.fonts.primary,
            fontSize: ptToRem(cvTokens.fontSize.body),
            color: cssColor(cvTokens.colors.mainText),
            letterSpacing: "0.01em",
          }}>
            {languages.join("  ·  ")}
          </p>
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto my-8 print:my-0 bg-white shadow-lg print:shadow-none overflow-hidden">
      {/* Header band */}
      <ATSHeader personal={personal} hiddenSections={hiddenSections} />

      {/* Body content with generous padding */}
      <div className="px-12 py-8 print:px-8 print:py-6">
        {/* Summary — with a subtle left accent border */}
        {!hiddenSections?.summary && summary && (
          <div
            className="mb-6 pl-4"
            style={{
              borderLeft: `3px solid ${cssColor(cvTokens.colors.atsAccent)}`,
            }}
          >
            <CVSummary text={summary} />
          </div>
        )}

        {/* Sections */}
        <div className="space-y-1">
          {renderOrderedSections()}
        </div>
      </div>
    </div>
  );
}
