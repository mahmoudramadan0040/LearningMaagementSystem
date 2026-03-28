"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  roles: string[];
  children: React.ReactNode;
}

export default function RoleBased({ roles, children }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;
  return roles.includes(user.role) ? <>{children}</> : null;
}
