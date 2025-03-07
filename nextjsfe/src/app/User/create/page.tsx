/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getApiKey, getAuthToken } from "../../utils/authHelper";

export default function PersonCreate() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const createUser = useMutation({
        mutationFn: async (newUser: any) => {
            const token = await getAuthToken();
            const apiKey = await getApiKey(token);

            const res = await fetch("http://localhost:3000/api/users/data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "nx-api": apiKey
                },
                body: JSON.stringify(newUser),
            });

            const text = await res.text();
            console.log("Response Text:", text);

            try {
                return JSON.parse(text);
            } catch (error) {
                throw new Error(`Invalid JSON Response: ${text}`);
            }
        },
        onSuccess: () => {
            setIsOpen(true);
            queryClient.invalidateQueries({ queryKey: ["users"] }); 
        },
        onError: (error) => {
            console.error("Create Error:", error);
            alert(`Gagal membuat pengguna: ${error.message}`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createUser.mutate({ username, name, address, phone });
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

            {/* Alert Dialog */}
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Created User Data Successfully</AlertDialogTitle>
                        <AlertDialogDescription>You can close this page.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => {
                            setIsOpen(false);
                            router.push("/User");
                        }}>
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
