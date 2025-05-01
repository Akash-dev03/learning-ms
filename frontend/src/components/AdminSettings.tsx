import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings, Shield, Bell, Mail, Loader2 } from 'lucide-react';
import { settings as settingsApi } from '@/lib/api';

interface LibrarySettings {
  library_name: string;
  admin_email: string;
  max_books_per_user: number;
  loan_period_days: number;
  allow_reservations: boolean;
  auto_renewals_enabled: boolean;
  two_factor_required: boolean;
  force_password_reset_days: number;
  log_admin_activity: boolean;
  session_timeout_minutes: number;
  email_notifications_enabled: boolean;
  notification_settings: {
    due_date: boolean;
    overdue: boolean;
    availability: boolean;
    news: boolean;
  };
  reminder_days: number;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<LibrarySettings | null>(null);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsApi.get();
      setSettings(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      setIsSaving(true);
      await settingsApi.update({
        library_name: formData.get('library-name') as string,
        admin_email: formData.get('admin-email') as string,
        max_books_per_user: parseInt(formData.get('max-books') as string),
        loan_period_days: parseInt(formData.get('loan-days') as string),
        allow_reservations: (form.querySelector('#allow-reservations') as HTMLInputElement).checked,
        auto_renewals_enabled: (form.querySelector('#auto-renew') as HTMLInputElement).checked,
      });
      
      toast({
        title: "Settings saved",
        description: "Your general settings have been saved successfully."
      });
      await fetchSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    try {
      setIsSaving(true);
      await settingsApi.update({
        two_factor_required: (form.querySelector('#two-factor') as HTMLInputElement).checked,
        force_password_reset_days: parseInt(formData.get('force-password-reset') as string),
        log_admin_activity: (form.querySelector('#log-activity') as HTMLInputElement).checked,
        session_timeout_minutes: parseInt(formData.get('session-timeout') as string),
      });
      
      toast({
        title: "Security settings saved",
        description: "Your security settings have been updated successfully."
      });
      await fetchSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save security settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    try {
      setIsSaving(true);
      await settingsApi.update({
        email_notifications_enabled: (form.querySelector('#email-notifications') as HTMLInputElement).checked,
        notification_settings: {
          due_date: (form.querySelector('#notify-due') as HTMLInputElement).checked,
          overdue: (form.querySelector('#notify-overdue') as HTMLInputElement).checked,
          availability: (form.querySelector('#notify-available') as HTMLInputElement).checked,
          news: (form.querySelector('#notify-news') as HTMLInputElement).checked,
        },
        reminder_days: parseInt(formData.get('reminder-days') as string),
      });
      
      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated successfully."
      });
      await fetchSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load settings. Please try again.</p>
        <Button onClick={fetchSettings} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Settings</h2>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings size={16} /> General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} /> Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your library's general settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="library-name">Library Name</Label>
                      <Input 
                        id="library-name" 
                        name="library-name"
                        defaultValue={settings.library_name} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input 
                        id="admin-email" 
                        name="admin-email"
                        type="email" 
                        defaultValue={settings.admin_email} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-books">Maximum Books Per User</Label>
                      <Input 
                        id="max-books" 
                        name="max-books"
                        type="number" 
                        defaultValue={settings.max_books_per_user} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loan-days">Default Loan Period (days)</Label>
                      <Input 
                        id="loan-days" 
                        name="loan-days"
                        type="number" 
                        defaultValue={settings.loan_period_days} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="allow-reservations" 
                      defaultChecked={settings.allow_reservations} 
                    />
                    <Label htmlFor="allow-reservations">Allow users to reserve books</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-renew" 
                      defaultChecked={settings.auto_renewals_enabled} 
                    />
                    <Label htmlFor="auto-renew">Enable automatic renewals</Label>
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save General Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for your library system.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSecuritySettings} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="two-factor" 
                      defaultChecked={settings.two_factor_required} 
                    />
                    <Label htmlFor="two-factor">Require two-factor authentication for admins</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="force-password-reset" 
                      defaultChecked={settings.force_password_reset_days === 90} 
                    />
                    <Label htmlFor="force-password-reset">Force password reset every 90 days</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="log-activity" 
                      defaultChecked={settings.log_admin_activity} 
                    />
                    <Label htmlFor="log-activity">Log all admin activity</Label>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="session-timeout" 
                      name="session-timeout"
                      type="number" 
                      defaultValue={settings.session_timeout_minutes} 
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Security Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how notifications are sent to users.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotificationSettings} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="flex items-center gap-2">
                        <Mail size={16} /> Email Notifications
                      </Label>
                      <Switch 
                        id="email-notifications" 
                        defaultChecked={settings.email_notifications_enabled} 
                      />
                    </div>
                    <p className="text-sm text-gray-500">Send email notifications for various events</p>
                  </div>
                  
                  <div className="border rounded-md p-4 space-y-2">
                    <h4 className="font-medium">Email Notification Types</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="notify-due" 
                          defaultChecked={settings.notification_settings.due_date} 
                        />
                        <Label htmlFor="notify-due">Due date reminders</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="notify-overdue" 
                          defaultChecked={settings.notification_settings.overdue} 
                        />
                        <Label htmlFor="notify-overdue">Overdue notifications</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="notify-available" 
                          defaultChecked={settings.notification_settings.availability} 
                        />
                        <Label htmlFor="notify-available">Book availability alerts</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="notify-news" 
                          defaultChecked={settings.notification_settings.news} 
                        />
                        <Label htmlFor="notify-news">Library news and updates</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reminder-days">Send due date reminder days in advance</Label>
                    <Input 
                      id="reminder-days" 
                      name="reminder-days"
                      type="number" 
                      defaultValue={settings.reminder_days} 
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Notification Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
