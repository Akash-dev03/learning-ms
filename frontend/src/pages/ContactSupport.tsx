
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  category: z.string().min(1, { message: "Please select a category" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactSupport = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = (data: ContactFormValues) => {
    console.log("Contact form submitted:", data);
    
    toast({
      title: "Message sent",
      description: "We've received your message and will respond within 24-48 hours.",
    });
    
    form.reset();
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Contact Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex flex-col items-center p-6 text-center">
            <Mail className="h-10 w-10 text-library-primary mb-3" />
            <h3 className="font-medium text-lg">Email</h3>
            <p className="text-gray-500 mb-2">Reach us via email</p>
            <p className="font-medium">support@libramind.com</p>
          </Card>
          
          <Card className="flex flex-col items-center p-6 text-center">
            <Phone className="h-10 w-10 text-library-primary mb-3" />
            <h3 className="font-medium text-lg">Phone</h3>
            <p className="text-gray-500 mb-2">Call our support team</p>
            <p className="font-medium">+91 9876543210</p>
          </Card>
          
          <Card className="flex flex-col items-center p-6 text-center">
            <MessageCircle className="h-10 w-10 text-library-primary mb-3" />
            <h3 className="font-medium text-lg">Live Chat</h3>
            <p className="text-gray-500 mb-2">Chat with a librarian</p>
            <p className="font-medium">Available 9 AM - 6 PM</p>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Support Request Form</CardTitle>
            <CardDescription>Fill out this form to get help from our support team.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="book">Book Inquiries</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Fees</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of your issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide details about your issue" 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Please include any relevant details that might help us assist you better.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="bg-library-primary hover:bg-library-secondary">
                  Submit Support Request
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t pt-6">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                For urgent matters requiring immediate assistance, please call our support line directly. 
                For general inquiries, we typically respond within 24-48 hours via email.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ContactSupport;
