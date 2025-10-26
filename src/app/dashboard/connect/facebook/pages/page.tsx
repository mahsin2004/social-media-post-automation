import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/dashboard/Layout';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  perms: string[];
}

export default function FacebookPageSelection() {
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFacebookPages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/connect/facebook/pages`);
        setPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching Facebook pages:", error);
        toast({
          title: "Error",
          description: "Failed to load Facebook pages. Please try again.",
          variant: "destructive",
        });
        router.push('/dashboard'); // Redirect to dashboard on error
      } finally {
        setLoading(false);
      }
    };

    fetchFacebookPages();
  }, [router, toast]);

  const handlePageSelect = async (page: FacebookPage) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/connect/facebook/select-page`, {
        pageId: page.id,
        pageAccessToken: page.access_token,
        pagePerms: page.perms,
      });
      toast({
        title: "Success",
        description: `${page.name} connected successfully!`, 
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error connecting Facebook page:", error);
      toast({
        title: "Error",
        description: `Failed to connect ${page.name}. Please try again.`, 
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <p>Loading Facebook pages...</p>
        </div>
      </Layout>
    );
  }

  if (pages.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <p>No Facebook pages found or you have not granted necessary permissions.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Select a Facebook Page to Connect</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div key={page.id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-2">{page.name}</h2>
              <p className="text-gray-600">ID: {page.id}</p>
              <button
                onClick={() => handlePageSelect(page)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Connect Page
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}