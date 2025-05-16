
"use client";

import UserManagementTable from '@/components/admin/user-management-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Settings, MessageSquareWarning, MapPin } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex-grow p-4 md:p-8 space-y-8 bg-muted/40">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Console</h1>
        <p className="text-muted-foreground">Manage users, content, and settings for LooView.</p>
      </header>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="mr-2 h-4 w-4" /> User Management
          </TabsTrigger>
          <TabsTrigger value="toilets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MapPin className="mr-2 h-4 w-4" /> Toilet Management
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessageSquareWarning className="mr-2 h-4 w-4" /> Review Moderation
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="mr-2 h-4 w-4" /> App Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, edit, and manage user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagementTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toilets">
          <Card>
            <CardHeader>
              <CardTitle>Toilet Management</CardTitle>
              <CardDescription>Manage toilet listings. (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Functionality to manage toilet entries will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Review Moderation</CardTitle>
              <CardDescription>Approve, edit, or remove user reviews. (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Tools for moderating reviews will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure global settings for LooView. (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Global application settings will be managed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
