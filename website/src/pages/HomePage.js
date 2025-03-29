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
        
        // For featured NEPs, we'll select some important ones
        // In a real app, this might be determined by a specific tag or field
        // For now, we'll just pick some based on status and type
        const featured = data.filter(nep => 
          nep.status === 'Final' && 
          (nep.type === 'Standards Track' || parseInt(nep.number) <= 5)
        ).slice(0, 3);
        
        setFeaturedNEPs(featured);
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
      // Mock featured NEPs
      const mockFeaturedNEPs = [
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
          number: '17',
          title: 'NEP-17: Neo Token Standard',
          status: 'Final',
          authors: ['Erik Zhang', 'Yu Liu'],
          type: 'Standards Track',
          category: 'Token',
          created_at: '2020-07-15T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-17.mediawiki'
        }
      ];
      
      // Mock recent NEPs
      const mockRecentNEPs = [
        {
          number: '20',
          title: 'NEP-20: Oracle Service',
          status: 'Final',
          authors: ['Yu Liu', 'John deVadoss'],
          type: 'Standards Track',
          category: 'Core',
          created_at: '2021-05-10T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-20.mediawiki'
        },
        {
          number: '21',
          title: 'NEP-21: NeoFS Integration',
          status: 'Final',
          authors: ['Alexey Vanin', 'Stanislav Bogatyrev'],
          type: 'Standards Track',
          category: 'Storage',
          created_at: '2021-04-15T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-21.mediawiki'
        },
        {
          number: '22',
          title: 'NEP-22: Generalized RPC Interface',
          status: 'Final',
          authors: ['Erik Zhang', 'Igor M. Coelho'],
          type: 'Standards Track',
          category: 'API',
          created_at: '2021-03-20T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-22.mediawiki'
        },
        {
          number: '23',
          title: 'NEP-23: JSON-RPC Error Codes',
          status: 'Draft',
          authors: ['Vitor Nazário Coelho', 'Igor M. Coelho'],
          type: 'Standards Track',
          category: 'API',
          created_at: '2021-02-15T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-23.mediawiki'
        },
        {
          number: '24',
          title: 'NEP-24: NFT Standard',
          status: 'Draft',
          authors: ['Yongquan Gu', 'Jinghui Liao'],
          type: 'Standards Track',
          category: 'Token',
          created_at: '2021-01-10T00:00:00Z',
          html_url: 'https://github.com/neo-project/proposals/blob/master/nep-24.mediawiki'
        }
      ];
      
      setFeaturedNEPs(mockFeaturedNEPs);
      setRecentNEPs(mockRecentNEPs);
    };

    fetchNEPs();
  }, []);

  const renderNEPCard = (nep) => (
    <Link 
      to={`/nep/${nep.number}`} 
      key={nep.number}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            NEP-{nep.number}: {nep.title}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
            nep.status === 'Final' ? 'bg-green-100 text-green-800' : 
            nep.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {nep.status}
          </span>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Created: {new Date(nep.created_at).toLocaleDateString()}
      </p>
    </Link>
  );

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
    <div>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Neo Enhancement</span>
              <span className="block text-green-600">Proposals (NEPs)</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              NEPs describe standards for the Neo platform, including core protocol specifications, client APIs, and contract standards.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/neps" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                  Browse All NEPs
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link to="/working-neps" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  View Working NEPs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured NEPs */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Featured</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Key Neo Enhancement Proposals
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              These NEPs form the foundation of the Neo ecosystem and are essential for developers.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredNEPs.map(nep => renderNEPCard(nep))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent NEPs */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Recent NEPs</h2>
          <div className="mt-6 space-y-4">
            {recentNEPs.map(nep => renderNEPCard(nep))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/neps" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
              View All NEPs
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Get Involved Section */}
      <div className="bg-green-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Want to contribute?</span>
            <span className="block text-green-200">Get involved with Neo NEPs today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a href="https://github.com/neo-project/proposals" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50">
                GitHub Repository
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a href="https://docs.neo.org/docs/en-us/index.html" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-500">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
