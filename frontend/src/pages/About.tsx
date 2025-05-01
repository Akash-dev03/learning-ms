
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MapPin, Clock, Mail, Phone, MessageSquare, Users, Calendar, BookMarked } from 'lucide-react';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">About Libra Mind</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Libra Mind was founded with a simple yet powerful mission: to connect readers with knowledge and stories that inspire, educate, and transform. We believe that access to books and information is a fundamental right and essential for personal growth and community development.
            </p>
            <p className="text-gray-600">
              Our AI-powered library system is designed to make discovering and accessing books easier than ever, while creating a vibrant community of readers and learners. We're committed to innovation in library services while preserving the timeless joy of reading.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <BookOpen className="h-10 w-10 text-library-primary mb-3" />
              <h3 className="font-medium">10,000+</h3>
              <p className="text-sm text-gray-500">Books Available</p>
            </Card>
            
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-10 w-10 text-library-primary mb-3" />
              <h3 className="font-medium">5,000+</h3>
              <p className="text-sm text-gray-500">Active Members</p>
            </Card>
            
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <Calendar className="h-10 w-10 text-library-primary mb-3" />
              <h3 className="font-medium">Since 2022</h3>
              <p className="text-sm text-gray-500">Serving Readers</p>
            </Card>
            
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <BookMarked className="h-10 w-10 text-library-primary mb-3" />
              <h3 className="font-medium">500+</h3>
              <p className="text-sm text-gray-500">Monthly Loans</p>
            </Card>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Library Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 5:00 PM</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <p>123 Reading Avenue</p>
                  <p>Booktown, BK 12345</p>
                  <p className="mt-2">Located near Central Park, <br />2nd floor of the Knowledge Building</p>
                </address>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 shrink-0" />
                    <span>(555) 123-4567</span>
                  </li>
                  <li className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 shrink-0" />
                    <span>info@libramind.com</span>
                  </li>
                  <li className="flex items-start">
                    <MessageSquare className="h-5 w-5 mr-2 shrink-0" />
                    <span>Live chat available during working hours</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
