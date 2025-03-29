import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { nepApi } from '../services/api';

const HomePage = () => {
  const [featuredNEPs, setFeaturedNEPs] = useState([]);
  const [recentNEPs, setRecentNEPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNEPs = async () => {
      try {
        setLoading(true);
        // Use our API service to fetch NEPs
        const data = await nepApi.getAllNEPs();
        
        // Sort NEPs by date (newest first)
        const sortedNEPs = data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        // Get the 5 most recent NEPs
        setRecentNEPs(sortedNEPs.slice(0, 5));
        
        // For featured NEPs, we'll select the key ones as specified (NEP 2, 6, 11, 17)
        const keyNEPNumbers = ['2', '6', '11', '17'];
        const featured = data.filter(nep => keyNEPNumbers.includes(nep.number));
        
        // If we couldn't find all the key NEPs, add some fallbacks
        if (featured.length < keyNEPNumbers.length) {
          const fallbackNEPs = data
            .filter(nep => !keyNEPNumbers.includes(nep.number) && nep.status === 'Final')
            .slice(0, keyNEPNumbers.length - featured.length);
          
          setFeaturedNEPs([...featured, ...fallbackNEPs]);
        } else {
          setFeaturedNEPs(featured);
        }
        
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
      // Mock featured NEPs - using the key NEPs as requested
      const mockFeaturedNEPs = [
        {
          number: '2',
          title: 'Wallet Provider',
          status: 'Final',
          type: 'Standards Track',
          created_at: '2018-03-15',
          summary: 'This NEP describes standards for wallet providers to interact with dApps in the Neo ecosystem.'
        },
        {
          number: '6',
          title: 'Tokens Permission',
          status: 'Final',
          type: 'Standards Track',
          created_at: '2018-04-28',
          summary: 'This NEP defines a token permission system for NEP-5 tokens to manage transfer permissions.'
        },
        {
          number: '11',
          title: 'Non-Fungible Token Standard',
          status: 'Final',
          type: 'Standards Track',
          created_at: '2020-08-11',
          summary: 'This NEP describes a standard for non-fungible tokens on the Neo blockchain.'
        },
        {
          number: '17',
          title: 'NeoFS',
          status: 'Final',
          type: 'Standards Track',
          created_at: '2020-02-14',
          summary: 'This NEP describes the NeoFS distributed decentralized object storage system.'
        }
      ];
      
      // Mock recent NEPs
      const mockRecentNEPs = [
        {
          number: '20',
          title: 'Oracle Implementation',
          status: 'Draft',
          type: 'Standards Track',
          created_at: '2023-01-10',
          summary: 'This NEP proposes an oracle implementation for Neo N3.'
        },
        {
          number: '19',
          title: 'LightDB Improvements',
          status: 'Draft',
          type: 'Standards Track',
          created_at: '2022-12-05',
          summary: 'This NEP proposes improvements to the LightDB storage system.'
        },
        {
          number: '18',
          title: 'Governance Mechanism',
          status: 'Accepted',
          type: 'Standards Track',
          created_at: '2022-11-20',
          summary: 'This NEP describes a governance mechanism for Neo N3.'
        },
        {
          number: '17',
          title: 'NeoFS',
          status: 'Final',
          type: 'Standards Track',
          created_at: '2020-02-14',
          summary: 'This NEP describes the NeoFS distributed decentralized object storage system.'
        },
        {
          number: '6',
          title: 'Tokens Permission',
          status: 'Final',
          type: 'Standards Track',
          created_at: '2018-04-28',
          summary: 'This NEP defines a token permission system for NEP-5 tokens to manage transfer permissions.'
        }
      ];
      
      setFeaturedNEPs(mockFeaturedNEPs);
      setRecentNEPs(mockRecentNEPs);
    };

    fetchNEPs();
  }, []);

  return (
    <div>
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Neo N3 Proposals
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              NEPs describe standards for the Neo platform, including core protocol specifications, client APIs, and contract standards.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Key Neo Enhancement Proposals
          </h2>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner"></div>
              <p className="mt-4 text-gray-600">Loading key NEPs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredNEPs.map(nep => (
                <div 
                  key={nep.number} 
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-neo-green-100 rounded-md p-3">
                        <span className="text-neo-green-600 text-xl font-bold">NEP-{nep.number}</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {nep.type}
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900 truncate">
                              {nep.title}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        nep.status === 'Final' ? 'bg-green-100 text-green-800' : 
                        nep.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {nep.status}
                      </span>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      {nep.summary || 'No summary available.'}
                    </div>
                    <div className="mt-4">
                      <Link 
                        to={`/nep/${nep.number}`}
                        className="text-neo-green-600 hover:text-neo-green-800 font-medium"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Recent NEPs
          </h2>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner"></div>
              <p className="mt-4 text-gray-600">Loading recent NEPs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {recentNEPs.map(nep => (
                  <li key={nep.number}>
                    <Link to={`/nep/${nep.number}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-neo-green-100 rounded-md p-2">
                              <span className="text-neo-green-600 font-bold">NEP-{nep.number}</span>
                            </div>
                            <p className="ml-4 text-sm font-medium text-gray-900 truncate">
                              {nep.title}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              nep.status === 'Final' ? 'bg-green-100 text-green-800' : 
                              nep.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {nep.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {nep.type}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Created on {new Date(nep.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link 
              to="/neps" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-neo-green-600 hover:bg-neo-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neo-green-500"
            >
              View All NEPs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
