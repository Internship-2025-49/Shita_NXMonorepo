"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { ColumnDef } from "@tanstack/react-table";
import { UserModel } from "../types/user";
import Link from "next/link";
import { fetcher } from "../libs/indes";
import DataTable from "../components/tableUser";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Label, Input, DialogFooter, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@components";
import { Plus } from "lucide-react";

export default function Users() {
    const [userList, setUserList] = useState<UserModel[]>([]);
    const { data, error } = useSWR<{ result: UserModel[] }>("/utils/queries/users", fetcher);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

    useEffect(() => {
        if (data && data.result) {
          setUserList(data.result);
        }
    }, [data]);

    console.log('data: ', data)

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const deleteUser = async (id: number) => {
        const res = await fetch(`/utils/queries/users/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        const content = await res.json();

        if (content.success > 0) {
            setUserList(userList.filter((user) => user.id !== id));
        }
    };

    const openEditDialog = (user: UserModel) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        const res = await fetch(`/utils/queries/users/${selectedUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedUser),
        });

        const content = await res.json();
        if (content) {
            setIsAlertOpen(true);
            setIsDialogOpen(false);

            setUserList((prev) =>
                prev.map((p) => (p.id === selectedUser.id ? selectedUser : p))
            );
        } else {
            alert(content.message);
        }
    };

    const columns: ColumnDef<UserModel>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "phone", header: "Phone" },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-5">
                    <Button variant="destructive" size="sm" className="m-1 p-2 border border-red-500 text-red-700 hover:bg-red-100" onClick={() => deleteUser(row.original.id)}>
                        Delete
                    </Button>

                    <Button variant="outline" size="sm" className="m-1 p-2 border border-yellow-500 text-yellow-700 hover:bg-yellow-100" onClick={() => openEditDialog(row.original)}>
                        Edit
                    </Button>
                    
                    <Link href={`/User/read/${row.original.id}`}>
                        <Button variant="outline" size="sm" className="m-1 p-2 border border-blue-500 text-blue-700 hover:bg-blue-100">View</Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-start">
                    <h2 className="text-2xl font-bold mb-7 ml-15 mr-243">
                        All Data: {userList.length}
                    </h2>

                    <Link href="/User/create">
                        <Button className="mb-7 bg-green-800 hover:bg-green-700 text-white flex items-center gap-2">
                        <Plus size={20} />
                        </Button>
                    </Link>
            </div>
    
            <div className="w-full overflow-auto">
                <DataTable columns={columns} data={userList} />
            </div>
            
            {/* Dialog Edit */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User Data</DialogTitle>
                        <DialogDescription>
                            Make changes to your data here. Click save when youre done.
                        </DialogDescription>
                    </DialogHeader>
    
                    <form onSubmit={updateUser} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">Username</Label>
                            <Input 
                                id="username" 
                                className="col-span-3" 
                                value={selectedUser?.username || ""}
                                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, username: e.target.value } : null)}
                            />
                        </div>
    
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input 
                                id="name" 
                                className="col-span-3" 
                                value={selectedUser?.name || ""}
                                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                        </div>
    
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">Address</Label>
                            <Input 
                                id="address" 
                                className="col-span-3" 
                                value={selectedUser?.address || ""}
                                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, address: e.target.value } : null)}
                            />
                        </div>
    
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input 
                                id="phone" 
                                className="col-span-3" 
                                value={selectedUser?.phone || ""}
                                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                            />
                        </div>
    
                        <DialogFooter>
                            <Button type="submit" className="bg-gray-700 hover:bg-gray-800 text-white">
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
    
            {/* Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Updated User Data Successfully</AlertDialogTitle>
                        <AlertDialogDescription>Your changes have been saved.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsAlertOpen(false)}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        
    );
}
