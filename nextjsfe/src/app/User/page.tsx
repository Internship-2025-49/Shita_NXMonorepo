/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUsers } from '../hook/queries/user';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useDeleteUser, usePutUser } from "../hook/mutations/user";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from "sonner"
import { useQueryClient } from '@tanstack/react-query';

export default function Users() {
    const queryClient = useQueryClient();
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    //DELETE Data
    const handleDeleteClick = (id: number) => {
        setSelectedUserId(id);
        setIsDeleteDialogOpen(true);
    };
    
    const mutation = useDeleteUser();

    //PUT Data
    const updateUser = usePutUser();
    
    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!selectedUser) {
            toast.error("No user selected!", {
                description: "Please select a user before saving changes.",
            });
            return;
        }
    
        updateUser.mutate(
            { id: selectedUser.id, updateData: selectedUser },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success("User updated successfully!", {
                        description: `User ${selectedUser.username} has been modified.`,
                        icon: "✅",
                    });
    
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                },
                onError: (error) => {
                    console.error("Update Error:", error);
                    toast.error("Failed to update user", {
                        description: "Something went wrong while updating user data.",
                    });
                },
            }
        );
    };
    
    const openEditDialog = (user: UserModel) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };
    
    //GET All Data
    const { data: users = [], isLoading, error } = useUsers(); 
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);

    const columns: ColumnDef<UserModel>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "phone", header: "Phone" },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center gap-5">
                    <Button variant="destructive" size="sm" className="m-1 p-2 border border-red-400 text-white hover:bg-red-400" onClick={() => handleDeleteClick(row.original.id)}>
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
                <Avatar>
                    <AvatarImage src="https://unpkg.com/@mynaui/icons/icons/users-group.svg" className="invert" alt="people" />
                    <AvatarFallback>People</AvatarFallback>
                </Avatar>

              <HoverCard>
                    <HoverCardTrigger asChild>
                        <h2 className="text-2xl ml-6 text-white">
                            Table of Users Data 
                        </h2>
                    </HoverCardTrigger>
                    
                    <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Shita Zeny</h4>

                                <p className="text-sm">
                                    From SMK Negeri 1 Cimahi, internship at</p>

                                <p className="text-sm">PT. Infinys System Indonesia.</p>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="group ml-auto">
                      <Button variant="ghost"><ChevronDown className="text-white group-hover:text-black transition-colors" size={20} /></Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        <Link href="/User/create" className="ml-auto">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Add User
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </Link>
                        
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Total Data {Array.isArray(users) ? users.length : 0}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="w-full overflow-auto">
                <DataTable columns={columns} data={paginatedUsers} />
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
    
                    <form onSubmit={handleUpdateUser} className="grid gap-4 py-4">
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

            {/*Alert Dialog Delete*/}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure for delete this data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deleted data cannot be recovered.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-gray-700 hover:bg-gray-800 text-white" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogAction>
                        <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => {
                                if (selectedUserId) {
                                  mutation.mutate(selectedUserId, {
                                    onSuccess: () => {
                                      toast("User deleted was successfully", {
                                        description: "The user has been removed from the database.",
                                        icon: "✅",
                                      });
                                    },
                                    onError: () => {
                                      toast.error("Failed to delete user", {
                                        description: "Something went wrong while deleting the user.",
                                      });
                                    }
                                  });
                                }
                              }}                              
                            >
                            {mutation.isPending ? "Removing..." : "Delete"}
                        </AlertDialogAction>

                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/*Pagination*/}
            <Pagination className='pt-10'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            href="#" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}/>
                    </PaginationItem>

                    {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink href="#" onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>{i + 1}</PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(users.length / itemsPerPage)))} className={currentPage === Math.ceil(users.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>


        </div>
    );
}
