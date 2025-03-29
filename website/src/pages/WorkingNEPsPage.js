import React, { useState, useEffect } from 'react';
import { nepApi } from '../services/api';

const WorkingNEPsPage = () => {
  const [workingNEPs, setWorkingNEPs] = useState([]);
  const [filteredNEPs, setFilteredNEPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchWorkingNEPs = async () => {
      try {
        setLoading(true);
        // Use our API service to fetch working NEPs
        const data = await nepApi.getWorkingNEPs();
        setWorkingNEPs(data);
        setFilteredNEPs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching working NEPs:', err);
        setError('Failed to load working NEPs. Please try again later.');
        
        // For development: set mock data when API fails
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    const setMockData = () => {
      // Mock working NEPs data for development
      const mockWorkingNEPs = [
        {
          id: 1,
          number: 101,
          nepNumber: '30',
          title: 'NEP-30: Oracle Service',
          html_url: 'https://github.com/neo-project/proposals/pull/101',
          user: {
            login: 'erikzhang',
            avatar_url: 'https://avatars.githubusercontent.com/u/139626?v=4',
            html_url: 'https://github.com/erikzhang'
          },
          created_at: '2021-08-15T10:30:00Z',
          updated_at: '2021-08-20T14:45:00Z',
          state: 'open',
          draft: false,
          labels: [
            { name: 'enhancement', color: '84b6eb' },
            { name: 'standards track', color: '1d76db' }
          ],
          body: 'This NEP proposes a standard interface for oracle services on Neo N3.',
          comments: 5
        },
        {
          id: 2,
          number: 102,
          nepNumber: '31',
          title: 'NEP-31: Domain Name Service',
          html_url: 'https://github.com/neo-project/proposals/pull/102',
          user: {
            login: 'dahongfei',
            avatar_url: 'https://avatars.githubusercontent.com/u/2630?v=4',
            html_url: 'https://github.com/dahongfei'
          },
          created_at: '2021-08-18T09:15:00Z',
          updated_at: '2021-08-22T11:30:00Z',
          state: 'open',
          draft: true,
          labels: [
            { name: 'enhancement', color: '84b6eb' },
            { name: 'standards track', color: '1d76db' }
          ],
          body: 'This NEP proposes a standard interface for domain name services on Neo N3.',
          comments: 3
        },
        {
          id: 3,
          number: 103,
          nepNumber: '32',
          title: 'NEP-32: Decentralized Storage Integration',
          html_url: 'https://github.com/neo-project/proposals/pull/103',
          user: {
            login: 'joeqian',
            avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
            html_url: 'https://github.com/joeqian'
          },
          created_at: '2021-08-20T14:00:00Z',
          updated_at: '2021-08-23T16:15:00Z',
          state: 'open',
          draft: false,
          labels: [
            { name: 'enhancement', color: '84b6eb' },
            { name: 'standards track', color: '1d76db' },
            { name: 'storage', color: 'fbca04' }
          ],
          body: 'This NEP proposes a standard interface for integrating decentralized storage solutions with Neo N3.',
          comments: 7
        },
        {
          id: 4,
          number: 104,
          nepNumber: '33',
          title: 'NEP-33: Cross-Chain Interoperability',
          html_url: 'https://github.com/neo-project/proposals/pull/104',
          user: {
            login: 'lllwvlvwlll',
            avatar_url: 'https://avatars.githubusercontent.com/u/67890?v=4',
            html_url: 'https://github.com/lllwvlvwlll'
          },
          created_at: '2021-08-22T11:45:00Z',
          updated_at: '2021-08-25T13:30:00Z',
          state: 'open',
          draft: false,
          labels: [
            { name: 'enhancement', color: '84b6eb' },
            { name: 'standards track', color: '1d76db' },
            { name: 'interoperability', color: 'c2e0c6' }
          ],
          body: 'This NEP proposes a standard interface for cross-chain interoperability on Neo N3.',
          comments: 4
        },
        {
          id: 5,
          number: 105,
          nepNumber: '34',
          title: 'NEP-34: Decentralized Identity',
          html_url: 'https://github.com/neo-project/proposals/pull/105',
          user: {
            login: 'johndoe',
            avatar_url: 'https://avatars.githubusercontent.com/u/54321?v=4',
            html_url: 'https://github.com/johndoe'
          },
          created_at: '2021-08-25T09:00:00Z',
          updated_at: '2021-08-27T15:45:00Z',
          state: 'open',
          draft: true,
          labels: [
            { name: 'enhancement', color: '84b6eb' },
            { name: 'standards track', color: '1d76db' },
            { name: 'identity', color: 'd4c5f9' }
          ],
          body: 'This NEP proposes a standard interface for decentralized identity on Neo N3.',
          comments: 2
        }
      ];
      
      setWorkingNEPs(mockWorkingNEPs);
      setFilteredNEPs(mockWorkingNEPs);
    };

    fetchWorkingNEPs();
  }, []);

  useEffect(() => {
    // Filter and sort working NEPs whenever search or sort options change
    let result = [...workingNEPs];
    
    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(nep => 
        nep.title.toLowerCase().includes(search) || 
        nep.number.toString().includes(search) ||
        nep.user.login.toLowerCase().includes(search) ||
        (nep.body && nep.body.toLowerCase().includes(search)) ||
        (nep.labels && nep.labels.some(label => label.name.toLowerCase().includes(search)))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'number':
          aValue = a.number;
          bValue = b.number;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'created':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updated':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case 'comments':
          aValue = a.comments;
          bValue = b.comments;
          break;
        default:
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredNEPs(result);
  }, [workingNEPs, searchTerm, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
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
            Working NEPs
          </h2>
          <p className="mt-1 text-lg text-gray-500">
            Browse all NEPs currently in development (Pull Requests)
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Working NEPs
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by title, number, author, or labels"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
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
            <option value="updated">Last Updated</option>
            <option value="created">Created Date</option>
            <option value="number">PR Number</option>
            <option value="title">Title</option>
            <option value="comments">Comments</option>
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
        Showing {filteredNEPs.length} of {workingNEPs.length} Working NEPs
      </div>

      {/* Working NEPs List */}
      <div className="mt-6 space-y-4">
        {filteredNEPs.map((nep) => (
          <div key={nep.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={nep.user.avatar_url}
                      alt={nep.user.login}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      <a href={nep.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {nep.title}
                      </a>
                      {nep.draft && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      PR #{nep.number} opened by{' '}
                      <a href={nep.user.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-green-600 hover:text-green-500">
                        {nep.user.login}
                      </a>
                      {' '}on {new Date(nep.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {nep.comments}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM1 9a1 1 0 011-1h2a1 1 0 110 2H2a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Updated {formatDate(nep.updated_at)}
                  </span>
                </div>
              </div>
              {nep.labels && nep.labels.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {nep.labels.map((label) => (
                    <span
                      key={label.name}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `#${label.color}20`,
                        color: `#${label.color}`,
                        border: `1px solid #${label.color}`
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {nep.body && (
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500 line-clamp-3">
                  {nep.body}
                </p>
                <div className="mt-2">
                  <a
                    href={nep.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredNEPs.length === 0 && (
        <div className="mt-6 text-center py-12 px-4 sm:px-6 lg:px-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Working NEPs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                setSearchTerm('');
                setSortBy('updated');
                setSortOrder('desc');
              }}
            >
              Reset filters
            </button>
          </div>
        </div>
      )}

      {/* Create New NEP Button */}
      <div className="mt-8 text-center">
        <a
          href="https://github.com/neo-project/proposals/pulls"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create a New NEP
        </a>
      </div>
    </div>
  );
};

export default WorkingNEPsPage;
