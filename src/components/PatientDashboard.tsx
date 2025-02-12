import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClipboardList, UserCircle, Clock, Settings } from 'lucide-react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface PatientDashboardProps {
  address: string | undefined;
}

interface DentalRecord {
  dentist: string;
  procedure: string;
  description: string;
  diagnosis: string;
  timestamp: number;
}

export default function PatientDashboard({ address }: PatientDashboardProps) {
  const { getPatientRecordCount, getPatientRecordByIndex } = useWeb3();
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecords = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        const count = await getPatientRecordCount(address);
        
        const recordPromises = Array.from({ length: count }, (_, i) => 
          getPatientRecordByIndex(address, i)
        );
        
        const fetchedRecords = await Promise.all(recordPromises);
        setRecords(fetchedRecords.sort((a, b) => b.timestamp - a.timestamp)); // Sort by timestamp descending
        
      } catch (err) {
        console.error('Error fetching patient records:', err);
        setError(err instanceof Error ? err.message : 'Failed to load patient records');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [address, getPatientRecordCount, getPatientRecordByIndex]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <NavigationMenu className="h-16">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    "text-lg font-semibold text-gray-900 dark:text-white"
                  )}
                >
                  Patient Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <UserCircle className="w-6 h-6 text-blue-500" />
                    <CardTitle>Your Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Wallet Address:</p>
                    <p className="font-mono text-sm">{address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-purple-500" />
                    <CardTitle>Recent Activity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track your recent dental visits and procedures
                  </CardDescription>
                  {records.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-4">No recent activity</p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {records.slice(0, 3).map((record, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {record.procedure}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(record.timestamp * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="w-6 h-6 text-blue-500" />
                    <CardTitle>Dental Records</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No dental records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Procedure
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Diagnosis
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                        {records.map((record, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {new Date(record.timestamp * 1000).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {record.procedure}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {record.description}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {record.diagnosis}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="w-6 h-6 text-blue-500" />
                  <CardTitle>Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Privacy Settings</h3>
                    <p className="text-sm text-gray-500">Manage who can access your dental records</p>
                  </div>
                  <div className="pt-4">
                    <Button>
                      Update Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 