/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from 'react';
import * as React from "react"
import { useRouter } from 'next/navigation';
import { Button } from '@components';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components';
import { Label } from '@components';
import { Input } from '@components';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components';


export default function PersonCreate() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    
    const addUser = async (e: any) => {
        e.preventDefault();

        if (username !== "" && address !== "" && name !== "" && phone !== "") {
            
            const formData = {
                username: username,
                name: name,
                address: address,
                phone: phone,
            };

            const add = await fetch('/utils/queries/users', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const content = await add.json();
            
            console.log("Form Data: ", formData);
            console.log("content", content);

            if (content) {
                setIsOpen(true);
              } else {
                alert(content.message);
        }
        }
    };

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <span className="font-bold py-2 block text-2xl text-center mb-5">Add Data User</span>
            
            <Card className="w-full shadow-lg border">
                <CardHeader>
                    <CardContent>
                        <form onSubmit={addUser} className="grid gap-6">
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="username" className="text-lg">Username</Label>
                                <Input id="username" placeholder="Username" className="text-lg p-3" onChange={(e: any) => setUsername(e.target.value)}/>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="name" className="text-lg">Name</Label>
                                <Input id="name" placeholder="Name" className="text-lg p-3" onChange={(e: any) => setName(e.target.value)}/>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="address" className="text-lg">Address</Label>
                                <Input id="address" placeholder="Address" className="text-lg p-3" onChange={(e: any) => setAddress(e.target.value)}/>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="phone" className="text-lg">Phone</Label>
                                <Input id="phone" placeholder="+62" className="text-lg p-3" onChange={(e: any) => setPhone(e.target.value)}/>
                            </div>

                            <div className="flex justify-center">
                                <Button type="submit" className="w-full max-w-sm p-3 text-white bg-black text-lg hover:bg-gray-900">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </CardHeader>
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

