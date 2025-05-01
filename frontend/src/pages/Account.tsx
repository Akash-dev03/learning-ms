import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Book, Clock, BookOpen, Loader2, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { auth } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
  is_admin: boolean;
  active_loans_count: number;
  total_loans_count: number;
}

interface BookLoan {
  id: number;
  book_id: number;
  borrowed_date: string;
  due_date: string;
  returned_date: string | null;
  is_returned: boolean;
  book: {
    title: string;
    author: string;
  };
}

const Account = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const [profileData, loansData] = await Promise.all([
        auth.getProfile(),
        auth.getLoans()
      ]);
      setProfile(profileData);
      setLoans(loansData);
      setFormData(prev => ({
        ...prev,
        username: profileData.username,
        email: profileData.email
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive"
      });
      // If unauthorized, redirect to login
      if ((error as any)?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await auth.updateProfile({
        username: formData.username,
        email: formData.email
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      await fetchUserData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await auth.updatePassword(formData.currentPassword, formData.newPassword);
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || !profile) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  // Admin view
  if (profile.is_admin) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Admin Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-medium">{profile.username}</h3>
                  <p className="text-gray-500">{profile.email}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Admin since {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </Button>
                  <Link to="/admin" className="w-full">
                    <Button 
                      className="w-full bg-library-primary hover:bg-library-secondary text-white"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Go to Admin Panel
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="settings">
                <TabsList className="w-full">
                  <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="settings">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Update your account information.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              disabled={!isEditing || isSubmitting}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing || isSubmitting}
                            />
                          </div>
                          {isEditing && (
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save Changes
                            </Button>
                          )}
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your account password.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              disabled={isSubmitting}
                            />
                          </div>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Regular user view (existing code)
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-medium">{profile.username}</h3>
                  <p className="text-gray-500">{profile.email}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Reading Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Books Borrowed</span>
                      <span className="font-medium">{profile.total_loans_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currently Borrowed</span>
                      <span className="font-medium">{profile.active_loans_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="books" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="books">
                  <Book className="h-4 w-4 mr-2" />
                  My Books
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Clock className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <User className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="books">
                <Card>
                  <CardHeader>
                    <CardTitle>Currently Borrowed Books</CardTitle>
                    <CardDescription>Books you currently have checked out from the library.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loans.filter(loan => !loan.is_returned).length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        You don't have any books checked out at the moment.
                      </p>
                    ) : (
                      <div className="divide-y">
                        {loans
                          .filter(loan => !loan.is_returned)
                          .map((loan) => (
                            <div key={loan.id} className="py-4 flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{loan.book.title}</h4>
                                <p className="text-sm text-gray-500">
                                  By {loan.book.author}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Due: {new Date(loan.due_date).toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">Return</Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan History</CardTitle>
                    <CardDescription>Your complete book borrowing history.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loans.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        You haven't borrowed any books yet.
                      </p>
                    ) : (
                      <div className="divide-y">
                        {loans.map((loan) => (
                          <div key={loan.id} className="py-4">
                            <h4 className="font-medium">{loan.book.title}</h4>
                            <p className="text-sm text-gray-500">
                              By {loan.book.author}
                            </p>
                            <div className="flex gap-x-4 mt-1 text-sm text-gray-500">
                              <span>Borrowed: {new Date(loan.borrowed_date).toLocaleDateString()}</span>
                              {loan.is_returned ? (
                                <span>Returned: {new Date(loan.returned_date!).toLocaleDateString()}</span>
                              ) : (
                                <span className="text-yellow-600">Due: {new Date(loan.due_date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Update your account information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSubmitting}
                          />
                        </div>
                        {isEditing && (
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                          </Button>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your account password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Change Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
