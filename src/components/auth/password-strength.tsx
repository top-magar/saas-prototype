"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
    showRequirements?: boolean;
}

interface Requirement {
    label: string;
    test: (pwd: string) => boolean;
}

const requirements: Requirement[] = [
    { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    { label: "Contains uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
    { label: "Contains lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
    { label: "Contains number", test: (pwd) => /[0-9]/.test(pwd) },
    { label: "Contains special character", test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
];

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: "", color: "" };

        const passedRequirements = requirements.filter(req => req.test(password)).length;

        if (passedRequirements <= 2) {
            return { score: 1, label: "Weak", color: "bg-red-500" };
        } else if (passedRequirements === 3) {
            return { score: 2, label: "Fair", color: "bg-orange-500" };
        } else if (passedRequirements === 4) {
            return { score: 3, label: "Good", color: "bg-yellow-500" };
        } else {
            return { score: 4, label: "Strong", color: "bg-green-500" };
        }
    }, [password]);

    if (!password && !showRequirements) return null;

    return (
        <div className="space-y-3">
            {/* Strength meter */}
            {password && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Password strength:</span>
                        <span className={cn(
                            "font-medium",
                            strength.score === 1 && "text-red-500",
                            strength.score === 2 && "text-orange-500",
                            strength.score === 3 && "text-yellow-500",
                            strength.score === 4 && "text-green-500"
                        )}>
                            {strength.label}
                        </span>
                    </div>

                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                                    level <= strength.score ? strength.color : "bg-muted"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Requirements checklist */}
            {showRequirements && (
                <div className="space-y-1.5 text-xs">
                    {requirements.map((req, index) => {
                        const passed = password && req.test(password);
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center gap-2 transition-colors",
                                    passed ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
                                )}
                            >
                                {passed ? (
                                    <Check className="h-3.5 w-3.5 flex-shrink-0" />
                                ) : (
                                    <X className="h-3.5 w-3.5 flex-shrink-0" />
                                )}
                                <span>{req.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Helper function to validate password strength
export function getPasswordStrength(password: string): number {
    return requirements.filter(req => req.test(password)).length;
}

export function isPasswordStrong(password: string): boolean {
    return getPasswordStrength(password) >= 4;
}
