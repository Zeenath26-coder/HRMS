export interface PageMeta {
  title: string;
  subtitle: string;
}

export const PAGE_META: Record<string, PageMeta> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Here's what's happening across your organization.",
  },

  "/employees": {
    title: "Employees",
    subtitle: "Manage and monitor your organization's employees.",
  },

  "/departments": {
    title: "Departments",
    subtitle: "Manage and organize your organization's departments.",
  },

  "/jobs": {
    title: "Job Positions",
    subtitle: "Manage job positions and employee roles.",
  },

  "/projects": {
    title: "Projects",
    subtitle: "Manage projects and project team members.",
  },

  "/tasks": {
    title: "Tasks",
    subtitle: "Manage and track assigned tasks.",
  },
  "/task-assignments": {
    title: "Task Assignments",
    subtitle: "Assign tasks to employees and track their progress.",
  },
  "/my-tasks": {
    title: "My Tasks",
    subtitle: "View and manage the tasks assigned to you.",
  },
  "/users": {
    title: "Users",
    subtitle: "Manage user accounts, roles, and access.",
  },
  "/profile": {
    title: "My Profile",
    subtitle: "View and manage your account and employee information.",
  },
};

export const getPageMeta = (pathname: string): PageMeta => {
  if (PAGE_META[pathname]) {
    return PAGE_META[pathname];
  }

  const matchedKey = Object.keys(PAGE_META).find((key) =>
    pathname.startsWith(`${key}/`),
  );

  return matchedKey
    ? PAGE_META[matchedKey]
    : {
        title: "",
        subtitle: "",
      };
};
