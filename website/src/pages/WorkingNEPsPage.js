import React, { useState, useEffect } from 'react';
import { nepApi } from '../services/api';
import { Link } from 'react-router-dom';

const WorkingNEPsPage = () => {
  const [workingNEPs, setWorkingNEPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchWorkingNEPs = async () => {
      try {
        setLoading(true);
        const data = await nepApi.getWorkingNEPs();
        setWorkingNEPs(data);
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
      // Mock working NEPs data
      const mockWorkingNEPs = [
        {
          number: 'draft-1',
          title: 'NFT Marketplace Standard',
          status: 'Draft',
          type: 'Standards Track',
          category: 'NFT',
          created_at: '2023-01-15',
          last_updated: '2023-03-20',
          authors: ['John Smith', 'Jane Doe'],
          summary: 'This NEP proposes a standard interface for NFT marketplaces on Neo N3.'
        },
        {
          number: 'draft-2',
          title: 'Decentralized Identity',
          status: 'Draft',
          type: 'Standards Track',
          category: 'Identity',
          created_at: '2023-02-10',
          last_updated: '2023-03-15',
          authors: ['Alex Johnson', 'Maria Garcia'],
          summary: 'This NEP defines a decentralized identity framework for Neo N3.'
        },
        {
          number: 'draft-3',
          title: 'Cross-Chain Interoperability',
          status: 'Draft',
          type: 'Standards Track',
          category: 'Protocol',
          created_at: '2023-01-05',
          last_updated: '2023-03-10',
          authors: ['Wei Chen', 'Sarah Kim'],
          summary: 'This NEP proposes a standard for cross-chain interoperability between Neo and other blockchains.'
        },
        {
          number: 'review-1',
          title: 'Improved Consensus Mechanism',
          status: 'Review',
          type: 'Standards Track',
          category: 'Core',
          created_at: '2022-11-20',
          last_updated: '2023-02-28',
          authors: ['Erik Zhang', 'Da Hongfei'],
          summary: 'This NEP proposes improvements to the Neo N3 consensus mechanism.'
        },
        {
          number: 'review-2',
          title: 'Advanced Smart Contract Features',
          status: 'Review',
          type: 'Standards Track',
          category: 'Contract',
          created_at: '2022-12-15',
          last_updated: '2023-03-01',
          authors: ['Igor M. Coelho', 'Vitor Nazário Coelho'],
          summary: 'This NEP introduces advanced features for Neo N3 smart contracts.'
        }
      ];
      
      setWorkingNEPs(mockWorkingNEPs);
    };

    fetchWorkingNEPs();
  }, []);

  const filteredNEPs = activeFilter === 'all' 
    ? workingNEPs 
    : workingNEPs.filter(nep => nep.status.toLowerCase() === activeFilter.toLowerCase());

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'last call':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Working NEPs
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          NEPs that are currently in development and open for community input.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a filter</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-neo-green-500 focus:border-neo-green-500 sm:text-sm rounded-md"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All NEPs</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="last call">Last Call</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['All', 'Draft', 'Review', 'Last Call'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab.toLowerCase())}
                  className={`${
                    activeFilter === tab.toLowerCase()
                      ? 'border-neo-green-500 text-neo-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  aria-current={activeFilter === tab.toLowerCase() ? 'page' : undefined}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neo-green-500"></div>
          <p className="mt-4 text-gray-600">Loading working NEPs...</p>
        </div>
      ) : error ? (
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
      ) : filteredNEPs.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No NEPs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No working NEPs match the current filter.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredNEPs.map((nep) => (
              <li key={nep.number} className="hover:bg-gray-50">
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-neo-green-100 rounded-md p-2">
                        <span className="text-neo-green-600 font-bold">
                          {nep.number.startsWith('NEP-') ? nep.number : `NEP-${nep.number}`}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {nep.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(nep.status)} mr-2`}>
                            {nep.status}
                          </span>
                          <span className="text-sm text-gray-500 mr-2">
                            {nep.type}
                          </span>
                          {nep.category && (
                            <span className="text-sm text-gray-500">
                              Category: {nep.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link 
                        to={`/nep/${nep.number}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-neo-green-600 hover:bg-neo-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neo-green-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {nep.summary || 'No summary available.'}
                    </p>
                  </div>
                  <div className="mt-4 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-700 mr-1">Authors:</span>
                        {nep.authors ? nep.authors.join(', ') : 'Unknown'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        <span className="font-medium text-gray-700 mr-1">Last updated:</span>
                        {nep.last_updated ? new Date(nep.last_updated).toLocaleDateString() : 
                         (nep.created_at ? new Date(nep.created_at).toLocaleDateString() : 'Unknown')}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Contribute to Working NEPs</h2>
        <p className="text-gray-600 mb-4">
          Working NEPs are proposals that are still in development and need community feedback. You can contribute in several ways:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Review the NEP and provide feedback on the GitHub repository</li>
          <li>Submit pull requests with improvements or corrections</li>
          <li>Participate in discussions about the NEP on Discord or forum</li>
          <li>Test implementations of the NEP and report issues</li>
        </ul>
        <div className="mt-6">
          <a 
            href="https://github.com/neo-project/proposals" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neo-green-600 hover:text-neo-green-800 font-medium"
          >
            Visit the GitHub Repository →
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkingNEPsPage;
