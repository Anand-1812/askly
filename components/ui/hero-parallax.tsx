"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const HeroParallax = ({
    products,
    header,
}: {
    header: React.ReactNode;
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
}) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig
    );
    const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
    const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
    const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
        springConfig
    );
    return (
        <div
            ref={ref}
            className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-32 antialiased [perspective:1000px] [transform-style:preserve-3d]"
        >
            {header}
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className=""
            >
                <motion.div className="mb-16 flex flex-row-reverse space-x-10 space-x-reverse md:space-x-20">
                    {firstRow.map(product => (
                        <ProductCard product={product} translate={translateX} key={product.title} />
                    ))}
                </motion.div>
                <motion.div className="mb-16 flex flex-row space-x-10 md:space-x-20">
                    {secondRow.map(product => (
                        <ProductCard
                            product={product}
                            translate={translateXReverse}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row-reverse space-x-10 space-x-reverse md:space-x-20">
                    {thirdRow.map(product => (
                        <ProductCard product={product} translate={translateX} key={product.title} />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        link: string;
        thumbnail: string;
    };
    translate: MotionValue<number>;
}) => {
    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -14,
            }}
            key={product.title}
            className="group/product relative h-80 w-[24rem] flex-shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg md:h-96 md:w-[30rem]"
        >
            <Link href={product.link} className="block h-full w-full">
                <Image
                    src={product.thumbnail}
                    height="600"
                    width="600"
                    className="absolute inset-0 h-full w-full object-cover object-left-top"
                    alt={product.title}
                />
            </Link>
            <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-200 group-hover/product:opacity-100" />
            <h2 className="absolute bottom-4 left-4 line-clamp-2 pr-4 text-sm font-medium text-white">
                {product.title}
            </h2>
        </motion.div>
    );
};
