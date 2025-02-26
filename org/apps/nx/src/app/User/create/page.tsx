/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from 'react';
import * as React from "react"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className='font-bold py-2 block text-2xl text-center mb-5'>Add Data User</span>
            <Card className="w-[550px]" onSubmit={addUser}>
                <CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name" className="text-lg" >Username</Label>
                                    <Input id="username" placeholder="Username" className="text-lg p-5" onChange={(e: any) => setUsername(e.target.value)}/>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name" className="text-lg" >Name</Label>
                                    <Input id="name" placeholder="Name" className="text-lg p-5" onChange={(e: any) => setName(e.target.value)}/>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name" className="text-lg">Address</Label>
                                    <Input id="address" placeholder="Address" className="text-lg p-5" onChange={(e: any) => setAddress(e.target.value)}/>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name" className="text-lg">Phone</Label>
                                    <Input id="phone" placeholder="+62" className="text-lg p-5" onChange={(e: any) => setPhone(e.target.value)}/>
                                </div>

                                <div className='w-full flex justify-center py-2'>
                                    <Button className="w-80 p-5 text-white bg-black text-lg" variant="outline" size="sm">Submit</Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </CardHeader>
            </Card>

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
                        }}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        
    );
}

