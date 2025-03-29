import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { nepApi } from '../services/api';

const NEPsPage = () => {
  const [neps, setNeps] = useState([]);
  const [filteredNeps, setFilteredNeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchNEPs = async () => {
      try {
        setLoading(true);
        // Use our API service to fetch NEPs
        const data = await nepApi.getAllNEPs();
        setNeps(data);
        setFilteredNeps(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching NEPs:', err);
        setError('Failed to load NEPs. Please try again later.');
        
        // For development: set mock data when API fails
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    const setMockData = () => {
      // Mock NEP data for development
      const mockNeps = [
        {
          number: '1',
          title: 'NEP-1: NEP Purpose and Guidelines',
          status: 'Final',
          authors: ['Erik Zhang'],
          type: 'Process',
          created_at: '2017-07-15T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-1.mediawiki'
        },
        {
          number: '2',
          title: 'NEP-2: Passphrase Protected Private Key',
          status: 'Final',
          authors: ['Erik Zhang'],
          type: 'Standards Track',
          category: 'Wallet',
          created_at: '2017-08-10T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-2.mediawiki'
        },
        {
          number: '3',
          title: 'NEP-3: NeoContract ABI',
          status: 'Final',
          authors: ['Erik Zhang'],
          type: 'Standards Track',
          category: 'Smart Contract',
          created_at: '2017-09-05T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-3.mediawiki'
        },
        {
          number: '4',
          title: 'NEP-4: Dynamic Contract Invocation',
          status: 'Final',
          authors: ['Erik Zhang', 'Igor M. Coelho'],
          type: 'Standards Track',
          category: 'Smart Contract',
          created_at: '2017-10-20T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-4.mediawiki'
        },
        {
          number: '5',
          title: 'NEP-5: Token Standard',
          status: 'Final',
          authors: ['Erik Zhang', 'Da Hongfei'],
          type: 'Standards Track',
          category: 'Token',
          created_at: '2017-11-15T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-5.mediawiki'
        },
        {
          number: '6',
          title: 'NEP-6: Wallet Standard',
          status: 'Final',
          authors: ['Erik Zhang'],
          type: 'Standards Track',
          category: 'Wallet',
          created_at: '2018-01-10T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-6.mediawiki'
        },
        {
          number: '7',
          title: 'NEP-7: Trigger for Verification Usage',
          status: 'Draft',
          authors: ['Erik Zhang'],
          type: 'Standards Track',
          category: 'Smart Contract',
          created_at: '2018-02-15T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-7.mediawiki'
        },
        {
          number: '8',
          title: 'NEP-8: Stack Isolation for NeoVM',
          status: 'Final',
          authors: ['Erik Zhang'],
          type: 'Standards Track',
          category: 'Virtual Machine',
          created_at: '2018-03-20T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-8.mediawiki'
        },
        {
          number: '9',
          title: 'NEP-9: URI Scheme',
          status: 'Final',
          authors: ['Andrei', 'Apisit'],
          type: 'Standards Track',
          category: 'Wallet',
          created_at: '2018-04-25T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-9.mediawiki'
        },
        {
          number: '10',
          title: 'NEP-10: Composite Smart Contracts',
          status: 'Draft',
          authors: ['Erik Zhang'],
          type: 'Standards Track',
          category: 'Smart Contract',
          created_at: '2018-05-30T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-10.mediawiki'
        }
      ];
      
      setNeps(mockNeps);
      setFilteredNeps(mockNeps);
    };

    fetchNEPs();
  }, []);

  useEffect(() => {
    // Filter and sort NEPs whenever search, filter, or sort options change
    let result = [...neps];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(nep => nep.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(nep => 
        nep.title.toLowerCase().includes(search) || 
        nep.number.toString().includes(search) ||
        (nep.authors && nep.authors.some(author => author.toLowerCase().includes(search))) ||
        (nep.category && nep.category.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'number':
          aValue = parseInt(a.number);
          bValue = parseInt(b.number);
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = a.number;
          bValue = b.number;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredNeps(result);
  }, [neps, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'final':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'deferred':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
            Neo Enhancement Proposals
          </h2>
          <p className="mt-1 text-lg text-gray-500">
            Browse all NEPs in the Neo ecosystem
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search NEPs
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by title, number, author, or category"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="accepted">Accepted</option>
            <option value="final">Final</option>
            <option value="deferred">Deferred</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="number">Number</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
            <option value="date">Date</option>
          </select>
        </div>

        <div className="sm:col-span-1 flex items-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={toggleSortOrder}
          >
            {sortOrder === 'asc' ? (
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
            )}
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredNeps.length} of {neps.length} NEPs
      </div>

      {/* NEPs Table */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NEP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author(s)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNeps.map((nep) => (
                    <tr key={nep.number} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/nep/${nep.number}`} className="text-green-600 hover:text-green-900">
                          NEP-{nep.number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link to={`/nep/${nep.number}`} className="hover:text-gray-900">
                          {nep.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nep.authors ? nep.authors.join(', ') : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(nep.status)}`}>
                          {nep.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nep.type || 'Standards Track'}
                        {nep.category && <span className="ml-1 text-xs">({nep.category})</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(nep.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {filteredNeps.length === 0 && (
        <div className="mt-6 text-center py-12 px-4 sm:px-6 lg:px-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No NEPs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortBy('number');
                setSortOrder('asc');
              }}
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NEPsPage;
