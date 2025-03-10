/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePostUser } from "@/app/hook/mutations/user";

export default function PersonCreate() {
    const router = useRouter();
    
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const createUser = usePostUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createUser.mutate({ username, name, address, phone }, {
            onSuccess: () => {
                toast.success("User created successfully!", {
                    description: `User ${username} has been added.`,
                    icon: "✅",
                });

                router.push("/User");
            },
            onError: () => {
                toast.error("Failed to create user", {
                    description: "Something went wrong while adding the user.",
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <Card className="w-full max-w-lg shadow-lg border border-gray-400 bg-white p-6">
                <CardHeader className="bg-gray-700 text-white text-center py-3 rounded-t-md">
                    <h3 className="text-lg font-semibold">Add User Form</h3>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-5">
                        <div className="flex flex-col space-y-2 ml-5 mr-5 mt-5">
                            <Label htmlFor="username" className="text-gray-700">Username</Label>
                            <Input id="username" placeholder="Username" className="p-2 border border-gray-400" 
                                value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="flex flex-col space-y-2 ml-5 mr-5">
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input id="name" placeholder="Name" className="p-2 border border-gray-400" 
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="flex flex-col space-y-2 ml-5 mr-5">
                            <Label htmlFor="address" className="text-gray-700">Address</Label>
                            <Input id="address" placeholder="Address" className="p-2 border border-gray-400" 
                                value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        <div className="flex flex-col space-y-2 ml-5 mr-5">
                            <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                            <Input id="phone" placeholder="+62" className="p-2 border border-gray-400" 
                                value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>

                        <div className="flex justify-center">
                            <Button type="submit" className="w-full p-2 text-white bg-gray-700 hover:bg-gray-800"
                                disabled={createUser.isPending}>
                                {createUser.isPending ? "Creating..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
