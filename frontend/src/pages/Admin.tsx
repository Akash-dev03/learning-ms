import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book as BookIcon, Plus, Loader2 } from 'lucide-react';
import { Book } from '@/lib/types';
import { books as booksApi } from '@/lib/api';
import AddBookForm from '@/components/AddBookForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import UserManagement from '@/components/UserManagement';
import AdminSettings from '@/components/AdminSettings';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddBook = async (data: Partial<Book>) => {
    try {
      await booksApi.create(data);
      toast({
        title: "Success",
        description: "Book added successfully",
      });
      fetchBooks(); // Refresh the book list
      setIsAddingBook(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    }
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {currentPath === '/admin' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="flex items-center">
                      <SidebarTrigger className="mr-4 text-library-primary hover:text-library-secondary lg:hidden" />
                      <h1 className="text-2xl font-bold">Library Management</h1>
                    </div>
                    <p className="text-gray-500">Manage books, users and settings</p>
                  </div>
                  
                  <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
                    <DialogTrigger asChild>
                      <Button className="bg-library-primary hover:bg-library-secondary">
                        <Plus className="h-4 w-4 mr-2" /> Add New Book
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Add New Book</DialogTitle>
                      </DialogHeader>
                      <AddBookForm onSubmit={handleAddBook} />
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="px-4 pt-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All Books</TabsTrigger>
                        <TabsTrigger value="available">Available</TabsTrigger>
                        <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
                        <TabsTrigger value="archived">Archived</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    {isLoading ? (
                      <div className="p-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">Loading books...</p>
                      </div>
                    ) : (
                      <>
                        <TabsContent value="all" className="p-0">
                          <BookTable books={books} onRefresh={fetchBooks} />
                        </TabsContent>
                        
                        <TabsContent value="available" className="p-0">
                          <BookTable books={books.filter(book => book.is_available)} onRefresh={fetchBooks} />
                        </TabsContent>
                        
                        <TabsContent value="checked-out" className="p-0">
                          <BookTable books={books.filter(book => !book.is_available)} onRefresh={fetchBooks} />
                        </TabsContent>
                        
                        <TabsContent value="archived" className="p-0">
                          <div className="p-8 text-center text-gray-500">
                            No archived books found.
                          </div>
                        </TabsContent>
                      </>
                    )}
                  </Tabs>
                </div>
              </>
            )}
            
            {currentPath === '/admin/users' && <UserManagement />}
            {currentPath === '/admin/settings' && <AdminSettings />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

interface BookTableProps {
  books: Book[];
  onRefresh: () => void;
}

const BookTable = ({ books, onRefresh }: BookTableProps) => {
  const { toast } = useToast();

  const handleDelete = async (bookId: number) => {
    try {
      await booksApi.delete(bookId);
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="h-10 w-8 mr-3 overflow-hidden rounded">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <BookIcon size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{book.title}</span>
                </div>
              </TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genres.slice(0, 2).join(', ')}</TableCell>
              <TableCell>{book.published_year}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    book.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {book.is_available ? 'Available' : 'Checked Out'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;
