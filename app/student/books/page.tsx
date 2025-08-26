'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  description: string;
  school: string;
  price: number;
  coverImage: string;
  offersCount: number;
  isActive: boolean;
  category: string;
  rating: number;
  soldCount: number;
}

export default function StudentBooks() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['all', 'restaurant', 'retail', 'entertainment', 'services', 'health'];
  const schools = ['all', 'Mountain Brook High School', 'Vestavia Hills High School', 'Homewood High School'];

  useEffect(() => {
    // Simulate loading books data
    setTimeout(() => {
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'Birmingham Restaurant Deals',
          description: 'Amazing discounts at the best local restaurants',
          school: 'Mountain Brook High School',
          price: 25,
          coverImage: '/api/placeholder/300/400',
          offersCount: 45,
          isActive: true,
          category: 'restaurant',
          rating: 4.8,
          soldCount: 234
        },
        {
          id: '2',
          title: 'Local Retail Savings',
          description: 'Shop smart with exclusive student discounts',
          school: 'Vestavia Hills High School',
          price: 20,
          coverImage: '/api/placeholder/300/400',
          offersCount: 32,
          isActive: true,
          category: 'retail',
          rating: 4.6,
          soldCount: 189
        },
        {
          id: '3',
          title: 'Entertainment & Fun',
          description: 'Movie tickets, bowling, and entertainment deals',
          school: 'Homewood High School',
          price: 15,
          coverImage: '/api/placeholder/300/400',
          offersCount: 28,
          isActive: true,
          category: 'entertainment',
          rating: 4.7,
          soldCount: 156
        },
        {
          id: '4',
          title: 'Health & Wellness',
          description: 'Fitness, spa, and wellness discounts',
          school: 'Mountain Brook High School',
          price: 30,
          coverImage: '/api/placeholder/300/400',
          offersCount: 18,
          isActive: true,
          category: 'health',
          rating: 4.9,
          soldCount: 98
        },
        {
          id: '5',
          title: 'Professional Services',
          description: 'Tutoring, photography, and professional services',
          school: 'Vestavia Hills High School',
          price: 22,
          coverImage: '/api/placeholder/300/400',
          offersCount: 24,
          isActive: true,
          category: 'services',
          rating: 4.5,
          soldCount: 87
        },
        {
          id: '6',
          title: 'Complete City Deals',
          description: 'All-in-one package with every local deal',
          school: 'Homewood High School',
          price: 35,
          coverImage: '/api/placeholder/300/400',
          offersCount: 67,
          isActive: true,
          category: 'all',
          rating: 4.8,
          soldCount: 312
        }
      ];
      
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = books.filter(book => book.isActive);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by school
    if (selectedSchool !== 'all') {
      filtered = filtered.filter(book => book.school === selectedSchool);
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.soldCount - a.soldCount;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'offers':
          return b.offersCount - a.offersCount;
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory, selectedSchool, sortBy]);

  const handleBookClick = (bookId: string) => {
    router.push(`/student/books/${bookId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Coupon Books</h1>
              <p className="text-gray-600">Find the best deals in your area</p>
          </div>
            <Link
              href="/student/dashboard"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Books
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
        </div>
      </div>

      {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                  School
                </label>
                <select
                  id="school"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {schools.map(school => (
                    <option key={school} value={school}>
                      {school === 'all' ? 'All Schools' : school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="offers">Most Offers</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
            </div>
          </div>
        </div>

      {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* Book Cover */}
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-xl flex items-center justify-center">
                    <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {book.offersCount} offers
                    </span>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({book.rating})</span>
                    </div>
                    <span className="text-sm text-gray-500">{book.soldCount} sold</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${book.price}</p>
                      <p className="text-sm text-gray-500">{book.school}</p>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
