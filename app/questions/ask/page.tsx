import QuestionForm from "@/components/QuestionForm";
import React from "react";

const Page = () => {
    return (
        <div className="container mx-auto space-y-6 px-4 pb-20 pt-32">
            <div>
                <h1 className="text-3xl font-bold">Ask a public question</h1>
                <p className="mt-2 text-sm text-white/70">
                    Be specific and include enough detail so others can help quickly.
                </p>
            </div>
            <QuestionForm />
        </div>
    );
};

export default Page;
