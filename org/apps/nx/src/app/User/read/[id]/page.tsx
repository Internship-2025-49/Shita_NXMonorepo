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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className='font-bold py-2 block text-2xl text-center mb-5'>View User Data</span>
            <Card className="w-[450px]">
                <CardHeader></CardHeader>

                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={user.username} readOnly />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={user.name} readOnly />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={user.address} readOnly />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={user.phone} readOnly />
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button onClick={() => router.push("/User")}>Close</Button>
                </CardFooter>
            </Card>
        </div>
        
    );
}
