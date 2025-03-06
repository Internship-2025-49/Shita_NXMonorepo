'use client'
import { fetcher } from '@/app/lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import useSWR from 'swr';


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
      <div className="fixed inset-0 flex items-center justify-center">
          <Card className='w-full max-w-lg shadow-lg border border-gray-400 bg-white p-6'>
            {/* Header */}
            <CardHeader className="bg-gray-700 text-white text-center py-4 rounded-t-md">
              <h3 className="text-xl font-semibold">View User Data</h3>
            </CardHeader>
      
            {/* Form Content */}
            <CardContent className="p-6">
              <form className="grid gap-5">
                {[
                  { label: "Username", value: user.username },
                  { label: "Name", value: user.name },
                  { label: "Address", value: user.address },
                  { label: "Phone", value: user.phone },
                ].map((field) => (
                  <div key={field.label} className="flex flex-col space-y-1">
                    <Label htmlFor={field.label.toLowerCase()} className="text-gray-700 text-sm font-medium">
                      {field.label}
                    </Label>
                    <Input 
                      id={field.label.toLowerCase()} 
                      value={field.value} 
                      readOnly 
                      className="p-2 border border-gray-300 bg-gray-100 rounded-md"
                    />
                  </div>
                ))}
              </form>
      
              {/* Button */}
              <div className="mt-6">
                <Button 
                  className="w-full py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md"
                  onClick={() => router.push("/User")}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    
    );
}
