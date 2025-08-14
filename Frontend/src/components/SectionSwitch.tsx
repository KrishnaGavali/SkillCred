"use client";
import React from "react";
import { GraduationCap, Building } from "lucide-react";

const SectionSwitch = () => {
  const [selectedSection, setSelectedSection] = React.useState("applicants");

  return (
    <div className="w-[90%] z-50">
      {/* Section Switcher */}
      <div className="p-2 flex items-center justify-center sm:justify-start gap-x-2 bg-background border-x border-border-color">
        <div className="flex items-center gap-x-3 bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-border-color shadow-inner">
          {["applicants", "recruiters"].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              title={
                section === "applicants"
                  ? " Looking for opportunities"
                  : "🏢 Finding talent"
              }
              className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 font-medium
                ${
                  selectedSection === section
                    ? " bg-foreground text-primary-foreground"
                    : " "
                }`}
            >
              {section === "applicants" ? (
                <div className="flex items-center gap-x-1">
                  <GraduationCap /> <p>Applicants</p>
                </div>
              ) : (
                <div className="flex items-center gap-x-1">
                  <Building /> <p>Recruiters</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionSwitch;
