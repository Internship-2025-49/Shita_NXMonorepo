"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useUsersById } from "@/app/queries/user";

export default function Detail() {
    const router = useRouter();

    const { data: user, isLoading, error } = useUsersById();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>User not found.</div>;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <Card className="w-full max-w-lg shadow-lg border border-gray-400 bg-white p-6">
                <CardHeader className="bg-gray-700 text-white text-center py-4 rounded-t-md">
                    <h3 className="text-xl font-semibold">View User Data</h3>
                </CardHeader>
                <CardContent className="p-6">
                    <form className="grid gap-5">
                        {[
                            { label: "Username", value: user?.username || "N/A" },
                            { label: "Name", value: user?.name || "N/A" },
                            { label: "Address", value: user?.address || "N/A" },
                            { label: "Phone", value: user?.phone || "N/A" },
                        ].map((field) => (
                            <div key={field.label} className="flex flex-col space-y-1">
                                <Label htmlFor={field.label.toLowerCase()} className="text-gray-700 text-sm font-medium">
                                    {field.label}
                                </Label>
                                <Input
                                    id={field.label.toLowerCase()}
                                    value={field.value}
                                    readOnly
                                    className="p-2 border border-gray-300 bg-gray-100 rounded-md"
                                />
                            </div>
                        ))}
                    </form>
                    <div className="mt-6">
                        <Button
                            className="w-full py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md"
                            onClick={() => router.push("/User")}
                        >
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
