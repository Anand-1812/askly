import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases, storage } from "@/models/server/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
    let products: Array<{ title: string; link: string; thumbnail: string }> = [];

    try {
        const questions = await databases.listDocuments(db, questionCollection, [
            Query.orderDesc("$createdAt"),
            Query.limit(15),
        ]);

        products = questions.documents
            .filter(q => q.attachmentId)
            .map(q => ({
                title: q.title,
                link: `/questions/${q.$id}/${slugify(q.title)}`,
                thumbnail: storage.getFilePreview(questionAttachmentBucket, q.attachmentId),
            }));
    } catch (error) {
        console.error("HeroSection error:", error);
    }

    if (products.length === 0) {
        return (
            <section className="container mx-auto px-4 pb-10 pt-32">
                <HeroSectionHeader />
            </section>
        );
    }

    return <HeroParallax header={<HeroSectionHeader />} products={products} />;
}
