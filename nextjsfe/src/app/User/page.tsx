"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { UserModel } from "../types/user";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../components/tableUser";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query";
import { GET } from "../utils/queries/users/route"

export default function Users() {
    const [userList, setUserList] = useState<UserModel[]>([]);
    // const { data, error } = useSWR<{ result: UserModel[] }>("/utils/queries/users", fetcher);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

    //GET all data
    // useEffect(() => {
    //     if (data && data.result) {
    //       setUserList(data.result);
    //     }
    // }, [data]);

    const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: GET });

    if (isLoading) return <div>Loading...</div>;

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

    console.log('setValue:', isDialogOpen)

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
            setIsDialogOpen(false);
            setIsAlertOpen(true);
            

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
                    <Button variant="destructive" size="sm" className="m-1 p-2 border border-red-400 text-white hover:bg-red-400" onClick={() => deleteUser(row.original.id)}>
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
            <div className="flex items-center justify-start bg-gray-700 p-4 rounded-lg shadow-md w-[1010px] mb-5 mx-auto">
              <h2 className="text-2xl ml-6 text-white">
                All Data: {Array.isArray(users) ? users.length : 0}
              </h2>

              <Link href="/User/create" className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="group">
                      <Button variant="ghost"><ChevronDown className="text-white group-hover:text-black transition-colors" size={20} /></Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem>
                          Add Data
                          <DropdownMenuShortcut></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </Link>
            </div>

            <div className="w-full overflow-auto">
                <DataTable columns={columns} data={Array.isArray(users) ? users : []} />
            </div>
            
            {/* Dialog Edit */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="">
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
                        <AlertDialogAction className="bg-gray-700 hover:bg-gray-800 text-white" onClick={() => setIsAlertOpen(false)}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        
    );
}
