"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Registration failed");
                setLoading(false);
                return;
            }

            toast.success("Account created! Please check your email.");
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (error) {
            toast.error("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <form className={cn("flex flex-col gap-6 w-full", className)} {...props} onSubmit={handleSubmit}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your details to create your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <PasswordStrength password={password} showRequirements={false} />
                </Field>
                <Field>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create account"
                        )}
                    </Button>
                </Field>
                {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
                    <>
                        <FieldSeparator>Or continue with</FieldSeparator>
                        <Field>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            >
                                <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Sign up with Google
                            </Button>
                            <FieldDescription className="text-center">
                                Already have an account?{" "}
                                <Link href="/sign-in" className="underline underline-offset-4">
                                    Sign in
                                </Link>
                            </FieldDescription>
                        </Field>
                    </>
                )}
            </FieldGroup>
        </form>
    );
}
