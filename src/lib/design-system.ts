import { cn } from "@/lib/utils";

export const COMPONENT_CLASSES = {
    heading: "font-bold tracking-tight",
    body: "leading-relaxed",
    container: "container mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-12 md:py-16 lg:py-24",
    grid: "grid gap-6 md:gap-8",
    card: "bg-card text-card-foreground border shadow-sm"
};

export const VARIANTS = {
    text: {
        primary: "text-foreground",
        secondary: "text-muted-foreground",
        accent: "text-primary",
        destructive: "text-destructive"
    },
    card: {
        default: "rounded-xl",
        hover: "rounded-xl hover:shadow-md transition-shadow duration-200",
        interactive: "rounded-xl cursor-pointer hover:border-primary/50 transition-colors duration-200"
    }
};

export function createClassName(...inputs: (string | undefined | null | false)[]) {
    return cn(...inputs);
}
