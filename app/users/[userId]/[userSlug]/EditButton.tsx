"use client";

import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { IconPencil } from "@tabler/icons-react";

const EditButton = () => {
  const { userId, userSlug } = useParams();
  const { user } = useAuthStore();

  if (user?.$id !== userId) return null;

  return (
    <Link
      href={`/users/${userId}/${userSlug}/edit`}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-all duration-150 hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      <IconPencil className="h-3.5 w-3.5" />
      Edit profile
    </Link>
  );
};

export default EditButton;
