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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <span className="font-bold py-2 block text-2xl text-center mb-5 text-gray-700">Add User Data</span>
            
            <Card className="w-full shadow-lg border border-gray-400 bg-white">
                <CardHeader className="bg-gray-700 text-white text-center py-3 rounded-t-md">
                    <h3 className="text-lg font-semibold">User Form</h3>
                </CardHeader>

                <CardContent>
                    <form onSubmit={addUser} className="grid gap-5">
                        <div className="flex flex-col space-y-2 ml-5 mr-5 mt-5">
                            <Label htmlFor="username" className="text-gray-700">Username</Label>
                            <Input id="username" placeholder="Username" className="p-2 border border-gray-400" onChange={(e: any) => setUsername(e.target.value)}/>
                        </div>

                        <div className="flex flex-col space-y-2 ml-5 mr-5">
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input id="name" placeholder="Name" className="p-2 border border-gray-400" onChange={(e: any) => setName(e.target.value)}/>
                        </div>

                        <div className="flex flex-col space-y-2 ml-5 mr-5">
                            <Label htmlFor="address" className="text-gray-700">Address</Label>
                            <Input id="address" placeholder="Address" className="p-2 border border-gray-400" onChange={(e: any) => setAddress(e.target.value)}/>
                        </div>

                        <div className="flex flex-col space-y-2 ml-5 mr-5">
                            <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                            <Input id="phone" placeholder="+62" className="p-2 border border-gray-400" onChange={(e: any) => setPhone(e.target.value)}/>
                        </div>

                        <div className="flex justify-center">
                            <Button type="submit" className="w-full p-2 text-white bg-gray-700 hover:bg-gray-800">
                                Submit
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

