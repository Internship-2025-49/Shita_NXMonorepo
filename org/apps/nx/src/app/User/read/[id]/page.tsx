'use client'
import { use } from 'react';
import useSWR from 'swr';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@components"
import { Label } from '@components';
import { Input } from '@components';
import { Button } from '@components';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/app/libs/indes';

export default function Detail({ params }: { params: Promise<{ id: number }> }) {
    const resolvedParams = use(params);
    const { data: user, isLoading, error } = useSWR(`/utils/queries/users/${resolvedParams.id}`, fetcher);
    const router = useRouter();

    if (isLoading) return <div><span>Loading...</span></div>;
    if (error) return <div><span>Error fetching data</span></div>;
    if (!user) return <div><span>No user found</span></div>;

    if (user) {
        console.info("User Data: ", user)
    }

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <span className="font-bold py-2 block text-2xl text-center mb-5 text-gray-700">View User Data</span>

            <Card className="w-full shadow-lg border border-gray-400 bg-white">
                <CardHeader className="bg-gray-700 text-white text-center py-3 rounded-t-md">
                        <h3 className="text-lg font-semibold">User Form</h3>
                </CardHeader>

                <CardContent>
                    <form className="grid gap-5">
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-2 ml-5 mr-5 mt-3">
                                <Label htmlFor="username" className="text-gray-700">Username</Label>
                                <Input id="username" value={user.username} readOnly className="p-2 border border-gray-400"/>
                            </div>

                            <div className="flex flex-col space-y-2 ml-5 mr-5 mt-3">
                                <Label htmlFor="name" className="text-gray-700">Name</Label>
                                <Input id="name" value={user.name} readOnly className="p-2 border border-gray-400"/>
                            </div>

                            <div className="flex flex-col space-y-2 ml-5 mr-5 mt-3">
                                <Label htmlFor="address" className="text-gray-700">Address</Label>
                                <Input id="address" value={user.address} readOnly className="p-2 border border-gray-400"/>
                            </div>

                            <div className="flex flex-col space-y-2 ml-5 mr-5 mt-3">
                                <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                                <Input id="phone" value={user.phone} readOnly className="p-2 border border-gray-400"/>
                            </div>
                         </div>
                     </form>

                     <div className="flex justify-center">
                        <Button className="w-full p-2 text-white bg-gray-700 hover:bg-gray-800 mt-3" onClick={() => router.push("/User")}>Close</Button>
                    </div>
                </CardContent>
            </Card>
        </div>   
    );
}
