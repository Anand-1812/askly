import React from "react";

const Page = () => {
  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card/75 p-8 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Edit profile</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Profile editing is coming soon. You can already improve your profile by asking
            high quality questions and posting helpful answers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
