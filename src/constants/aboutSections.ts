interface AboutSectionsProps {
  t: (key: string) => string;
}

export const ABOUT_SECTIONS = ({ t }: AboutSectionsProps) => {
  return [
    { id: "summary", label: t("about.summary.title") },
    { id: "experience", label: t("about.experience.title") },
    { id: "projects", label: t("about.projects.title") },
    { id: "education", label: t("about.education.title") },
  ];
};
