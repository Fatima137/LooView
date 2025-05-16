
"use client";

import { useState, useMemo } from 'react';
import type { UserProfile } from '@/lib/types';
import { mockUserProfiles } from '@/lib/data'; // Using mock data for now
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ShieldCheck, ShieldOff, Trash2, UserCog, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface UserRowActionsProps {
  user: UserProfile;
  onAction: (action: 'block' | 'unblock' | 'delete' | 'makeAdmin' | 'removeAdmin', userId: string) => void;
}

function UserRowActions({ user, onAction }: UserRowActionsProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<'block' | 'unblock' | 'delete' | 'makeAdmin' | 'removeAdmin' | null>(null);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const handleActionClick = (actionType: 'block' | 'unblock' | 'delete' | 'makeAdmin' | 'removeAdmin') => {
    setAlertAction(actionType);
    // Customize alert messages based on action
    switch (actionType) {
      case 'block':
        setAlertTitle(`Block ${user.displayName}?`);
        setAlertDescription("This user will not be able to log in or contribute. Are you sure?");
        break;
      case 'unblock':
        setAlertTitle(`Unblock ${user.displayName}?`);
        setAlertDescription("This user will regain full access. Are you sure?");
        break;
      case 'delete':
        setAlertTitle(`Delete ${user.displayName}?`);
        setAlertDescription("This action cannot be undone. All user data will be permanently removed. Are you sure?");
        break;
      case 'makeAdmin':
        setAlertTitle(`Make ${user.displayName} an Admin?`);
        setAlertDescription("This user will gain administrative privileges. Are you sure?");
        break;
      case 'removeAdmin':
        setAlertTitle(`Remove Admin rights from ${user.displayName}?`);
        setAlertDescription("This user will lose administrative privileges. Are you sure?");
        break;
    }
    setIsAlertOpen(true);
  };

  const confirmAction = () => {
    if (alertAction) {
      onAction(alertAction, user.id);
    }
    setIsAlertOpen(false);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => alert("View user details (not implemented)")}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user.isBlocked ? (
            <DropdownMenuItem onClick={() => handleActionClick('unblock')} className="text-green-600 focus:bg-green-50 focus:text-green-700">
              <CheckCircle className="mr-2 h-4 w-4" /> Unblock User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleActionClick('block')} className="text-orange-600 focus:bg-orange-50 focus:text-orange-700">
              <XCircle className="mr-2 h-4 w-4" /> Block User
            </DropdownMenuItem>
          )}
          {user.isAdmin ? (
            <DropdownMenuItem onClick={() => handleActionClick('removeAdmin')}>
              <ShieldOff className="mr-2 h-4 w-4" /> Remove Admin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleActionClick('makeAdmin')}>
              <ShieldCheck className="mr-2 h-4 w-4" /> Make Admin
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleActionClick('delete')} className="text-destructive focus:bg-destructive/10 focus:text-destructive-foreground">
            <Trash2 className="mr-2 h-4 w-4" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className={alertAction === 'delete' || alertAction === 'block' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


export default function UserManagementTable() {
  // TODO: Replace with actual data fetching from Firestore
  const [users, setUsers] = useState<UserProfile[]>(mockUserProfiles);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleUserAction = (action: 'block' | 'unblock' | 'delete' | 'makeAdmin' | 'removeAdmin', userId: string) => {
    // In a real app, you would call Firebase functions or update Firestore here.
    // For now, we'll simulate the action and update local state.
    setUsers(prevUsers => {
      switch (action) {
        case 'block':
          return prevUsers.map(u => u.id === userId ? { ...u, isBlocked: true } : u);
        case 'unblock':
          return prevUsers.map(u => u.id === userId ? { ...u, isBlocked: false } : u);
        case 'delete':
          return prevUsers.filter(u => u.id !== userId);
        case 'makeAdmin':
          return prevUsers.map(u => u.id === userId ? { ...u, isAdmin: true } : u);
        case 'removeAdmin':
          return prevUsers.map(u => u.id === userId ? { ...u, isAdmin: false } : u);
        default:
          return prevUsers;
      }
    });

    toast({
      title: `User ${action === 'delete' ? 'deleted' : action + 'ed'}`,
      description: `User ${userId} has been successfully ${action === 'delete' ? 'deleted' : action + 'ed'}.`,
    });
    console.log(`Action: ${action} on user: ${userId}`);
  };


  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users (name, email, ID)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contributions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.isBlocked ? 'bg-muted/30 opacity-70' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profilePhotoUrl || `https://picsum.photos/seed/${user.id}/40/40`} alt={user.displayName} data-ai-hint="avatar user" />
                        <AvatarFallback>{user.displayName.substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email || 'N/A'}</TableCell>
                  <TableCell className="text-muted-foreground">{user.contributions}</TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge variant="destructive">Blocked</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge variant="default" className="bg-primary/10 text-primary border-primary/30">
                        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserRowActions user={user} onAction={handleUserAction} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
