import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconSchool,
  IconChalkboardTeacher,
  IconHome,
  IconUserX,
  IconUsers,
  IconUserOff,
  IconCalendarEvent,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "HOME",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Management Students",
  },
  {
    id: uniqueId(),
    title: "Students",
    icon: IconSchool,
    href: "/students",
    children: [
      {
        id: uniqueId(),
        title: "All Students",
        href: "/students",
        icon: IconUsers,
      },
      {
        id: uniqueId(),
        title: "Student Levels",
        href: "/students/levels",
        icon: IconSchool,
      },
      {
        id: uniqueId(),
        title: "Add Students",
        href: "/students/student/create",
        icon: IconUserPlus,
      },
      {
        id: uniqueId(),
        title: "Remove Students",
        href: "/students/student/delete",
        icon: IconUserOff,
      },
    ],
  },
  {
    navlabel: true,
    subheader: "Management Subjects",
  },
  {
    id: uniqueId(),
    title: "Subjects",
    icon: IconLayoutDashboard,
    href: "/subjects",
    children: [
      {
        id: uniqueId(),
        title: "All Subjects",
        href: "/subjects",
        icon: IconUsers,
      },
      {
        id: uniqueId(),
        title: "Add Subject",
        href: "/subjects/subject/add",
        icon: IconUserPlus,
      },
      {
        id: uniqueId(),
        title: "Modify Subject",
        href: "/subjects/subject/update",
        icon: IconUserPlus,
      },
      {
        id: uniqueId(),
        title: "Remove Subject",
        href: "/subjects/subject/delete",
        icon: IconUserOff,
      },
    ],
  },
  {
    navlabel: true,
    subheader: "Management Staff",
  },
  {
    id: uniqueId(),
    title: "Staff",
    icon: IconChalkboardTeacher,
    href: "/staff",
    children: [
      { id: uniqueId(), title: "All Staff", href: "/staff", icon: IconUsers },
      {
        id: uniqueId(),
        title: "Add Employee",
        href: "/staff/add",
        icon: IconUserPlus,
      },
      {
        id: uniqueId(),
        title: "Remove Employee",
        href: "/staff/delete",
        icon: IconUserOff,
      },
    ],
  },
  {
    navlabel: true,
    subheader: "Management Department",
  },
  {
    id: uniqueId(),
    title: "Departments",
    icon: IconChalkboardTeacher,
    href: "/departments",
    children: [
      {
        id: uniqueId(),
        title: "All department",
        href: "/departments",
        icon: IconUsers,
      },
      {
        id: uniqueId(),
        title: "New Department",
        href: "/departments/department/add",
        icon: IconUserPlus,
      },
    ],
  },
  {
    navlabel: true,
    subheader: "Management Exam Sessions",
  },
  {
    id: uniqueId(),
    title: "Exam Sessions",
    icon: IconCalendarEvent,
    href: "/exam-sessions",
  },
  {
    navlabel: true,
    subheader: "AUTH",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/auth/login",
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/auth/register",
  },
  
];

export default Menuitems;
