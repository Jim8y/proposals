import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          About Neo Enhancement Proposals
        </h1>
        
        <div className="mt-8 prose prose-green prose-lg">
          <p>
            Neo Enhancement Proposals (NEPs) describe standards for the Neo platform, including core protocol specifications, client APIs, and contract standards.
          </p>
          
          <h2>What is a NEP?</h2>
          <p>
            NEP stands for Neo Enhancement Proposal. A NEP is a design document providing information to the Neo community, or describing a new feature for Neo or its processes or environment. The NEP should provide a concise technical specification of the feature and a rationale for the feature.
          </p>
          
          <p>
            We intend NEPs to be the primary mechanisms for proposing new features, for collecting community technical input on an issue, and for documenting the design decisions that have gone into Neo. The NEP author is responsible for building consensus within the community and documenting dissenting opinions.
          </p>
          
          <h2>NEP Types</h2>
          <p>
            There are three types of NEP:
          </p>
          
          <ul>
            <li>
              <strong>Standards Track NEP</strong> describes any change that affects most or all Neo implementations, such as a change to the network protocol, a change in block or transaction validity rules, proposed application standards/conventions, or any change or addition that affects the interoperability of applications using Neo.
            </li>
            <li>
              <strong>Informational NEP</strong> describes a Neo design issue, or provides general guidelines or information to the Neo community, but does not propose a new feature. Informational NEPs do not necessarily represent a Neo community consensus or recommendation, so users and implementers are free to ignore Informational NEPs or follow their advice.
            </li>
            <li>
              <strong>Process NEP</strong> describes a process surrounding Neo or proposes a change to (or an event in) a process. Process NEPs are like Standards Track NEPs but apply to areas other than the Neo protocol itself. They may propose an implementation, but not to Neo's codebase; they often require community consensus; unlike Informational NEPs, they are more than recommendations, and users are typically not free to ignore them.
            </li>
          </ul>
          
          <h2>NEP Process</h2>
          <p>
            The NEP process follows these steps:
          </p>
          
          <ol>
            <li>Draft - The first formally tracked stage of a NEP in development.</li>
            <li>Accepted - A NEP that is ready to be reviewed by the community.</li>
            <li>Final - A NEP that has been adopted by the Neo community.</li>
            <li>Deferred - A NEP that is not being considered for immediate adoption.</li>
            <li>Rejected - A NEP that has been rejected.</li>
            <li>Superseded - A NEP that has been rendered obsolete by a later proposal.</li>
          </ol>
          
          <h2>Contributing</h2>
          <p>
            The Neo community encourages contributions to NEPs. If you have an idea for a new standard, feature, or process improvement, you can:
          </p>
          
          <ol>
            <li>Review existing NEPs to ensure your idea hasn't already been proposed.</li>
            <li>Discuss your idea with the community on Neo Discord or Neo Reddit.</li>
            <li>Draft your NEP following the template and guidelines.</li>
            <li>Submit a pull request to the <a href="https://github.com/neo-project/proposals" target="_blank" rel="noopener noreferrer">Neo Proposals repository</a>.</li>
          </ol>
          
          <h2>Resources</h2>
          <p>
            For more information about Neo and NEPs, check out these resources:
          </p>
          
          <ul>
            <li><a href="https://neo.org" target="_blank" rel="noopener noreferrer">Neo Official Website</a></li>
            <li><a href="https://docs.neo.org" target="_blank" rel="noopener noreferrer">Neo Documentation</a></li>
            <li><a href="https://github.com/neo-project" target="_blank" rel="noopener noreferrer">Neo GitHub</a></li>
            <li><a href="https://discord.gg/rvZFQ8f" target="_blank" rel="noopener noreferrer">Neo Discord</a></li>
          </ul>
        </div>
        
        <div className="mt-10 flex justify-center">
          <Link
            to="/neps"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Browse All NEPs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
