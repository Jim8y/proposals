import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { nepApi } from '../services/api';
import CommentList from '../components/comments';
import { format } from 'date-fns';

const NEPDetailPage = () => {
  const { nepNumber } = useParams();
  
  const [nep, setNep] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNEPDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch NEP details and content using our API service
        const nepData = await nepApi.getNEP(nepNumber);
        const contentData = await nepApi.getNEPContent(nepNumber);
        
        setNep(nepData);
        setContent(contentData);
        setError(null);
      } catch (err) {
        console.error('Error fetching NEP details:', err);
        setError('Failed to load NEP details. Please try again later.');
        
        // For development: set mock data when API fails
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    const setMockData = () => {
      // Mock NEP metadata
      const mockNep = {
        number: nepNumber,
        title: `NEP-${nepNumber}: Example NEP Title`,
        status: 'Final',
        created_at: '2021-01-01T00:00:00Z',
        authors: ['Erik Zhang', 'Da Hongfei'],
        type: 'Standards Track',
        category: 'Core',
        requires: [],
        replaces: [],
        superseded_by: []
      };
      
      // Mock NEP content (using MediaWiki format similar to actual NEPs)
      const mockContent = `
<pre>
  NEP: ${nepNumber}
  Title: Example NEP Title
  Author: Erik Zhang <erik@neo.org>, Da Hongfei <da@neo.org>
  Type: Standards Track
  Status: Final
  Created: 2021-01-01
</pre>

== Abstract ==

This is an example NEP that demonstrates the structure and format of a Neo Enhancement Proposal. NEPs are the primary mechanism for proposing new features, collecting community input on an issue, and documenting design decisions for Neo.

== Motivation ==

The motivation section should describe why the NEP is needed and what problems it solves. It should clearly explain why the existing specification is inadequate to address the problem that the NEP solves.

== Specification ==

The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Neo platforms.

== Rationale ==

The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work.

== Backwards Compatibility ==

All NEPs that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The NEP must explain how the author proposes to deal with these incompatibilities.

== Reference Implementation ==

The reference implementation must be completed before any NEP is given status "Final", but it need not be completed before the NEP is accepted. It is better to finish the specification and rationale first and reach consensus on it before writing code.

== Security Considerations ==

All NEPs should contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surface risks and can be used throughout the life cycle of the proposal.
`;
      
      setNep(mockNep);
      setContent(mockContent);
    };

    fetchNEPDetails();
  }, [nepNumber]);

  // Format date helper function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Function to convert MediaWiki format to Markdown
  const convertMediaWikiToMarkdown = (mediaWikiContent) => {
    if (!mediaWikiContent) return '';
    
    // Replace MediaWiki headings with Markdown headings
    let markdown = mediaWikiContent
      .replace(/^==\s*(.*?)\s*==$/gm, '## $1')
      .replace(/^===\s*(.*?)\s*===$/gm, '### $1')
      .replace(/^====\s*(.*?)\s*====$/gm, '#### $1')
      .replace(/^=====\s*(.*?)\s*=====$/gm, '##### $1')
      .replace(/^======\s*(.*?)\s*======$/gm, '###### $1');
    
    // Replace MediaWiki lists with Markdown lists
    markdown = markdown
      .replace(/^\*\s*(.*?)$/gm, '* $1')
      .replace(/^#\s*(.*?)$/gm, '1. $1');
    
    // Replace MediaWiki links with Markdown links
    markdown = markdown.replace(/\[\[(.*?)\|(.*?)\]\]/g, '[$2]($1)');
    markdown = markdown.replace(/\[\[(.*?)\]\]/g, '[$1]($1)');
    
    // Replace MediaWiki external links with Markdown links
    markdown = markdown.replace(/\[(https?:\/\/[^\s\]]+)\s+(.*?)\]/g, '[$2]($1)');
    
    // Replace MediaWiki bold and italic with Markdown
    markdown = markdown
      .replace(/'''(.*?)'''/g, '**$1**')
      .replace(/''(.*?)''/g, '*$1*');
    
    // Replace MediaWiki code blocks with Markdown code blocks
    markdown = markdown
      .replace(/<pre>([\s\S]*?)<\/pre>/g, '```\n$1\n```')
      .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');
    
    return markdown;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <Link to="/neps" className="text-green-600 hover:text-green-800">
          &larr; Back to NEPs List
        </Link>
      </div>
    );
  }

  // Render NEP details
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/neps" className="text-green-600 hover:text-green-800 mb-4 inline-block">
        &larr; Back to NEPs List
      </Link>
      
      {/* NEP header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          NEP-{nep?.number}: {nep?.title.replace(/^NEP-\d+:\s*/i, '')}
        </h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {nep?.status}
          </span>
          
          <span>
            <strong>Type:</strong> {nep?.type}
            {nep?.category && ` (${nep.category})`}
          </span>
          
          <span>
            <strong>Authors:</strong> {nep?.authors?.join(', ') || 'Unknown'}
          </span>
          
          <span>
            <strong>Created:</strong> {nep?.created_at ? formatDate(nep.created_at) : 'Unknown'}
          </span>
        </div>
        
        {/* Related NEPs */}
        <div className="mt-4 space-y-1 text-sm">
          {nep?.requires?.length > 0 && (
            <p>
              <strong>Requires:</strong>{' '}
              {nep.requires.map((req, i) => (
                <React.Fragment key={req}>
                  <Link to={`/neps/${req}`} className="text-green-600 hover:text-green-800">
                    NEP-{req}
                  </Link>
                  {i < nep.requires.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))}
            </p>
          )}
          
          {nep?.replaces?.length > 0 && (
            <p>
              <strong>Replaces:</strong>{' '}
              {nep.replaces.map((rep, i) => (
                <React.Fragment key={rep}>
                  <Link to={`/neps/${rep}`} className="text-green-600 hover:text-green-800">
                    NEP-{rep}
                  </Link>
                  {i < nep.replaces.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))}
            </p>
          )}
          
          {nep?.superseded_by?.length > 0 && (
            <p>
              <strong>Superseded by:</strong>{' '}
              {nep.superseded_by.map((sup, i) => (
                <React.Fragment key={sup}>
                  <Link to={`/neps/${sup}`} className="text-green-600 hover:text-green-800">
                    NEP-{sup}
                  </Link>
                  {i < nep.superseded_by.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      </header>
      
      {/* NEP content */}
      <div className="prose prose-green max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          children={convertMediaWikiToMarkdown(content)}
        />
      </div>
      
      {/* Comments section */}
      <CommentList nepNumber={nepNumber} />
    </div>
  );
};

export default NEPDetailPage;
