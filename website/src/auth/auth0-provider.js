import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

// Auth0Provider with navigation capabilities
const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  // Handle authentication callback
  const onRedirectCallback = (appState) => {
    // Navigate to the route the user was attempting to access before login
    navigate(appState?.returnTo || window.location.pathname);
  };

  // Get Auth0 configuration from environment variables
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  const redirectUri = window.location.origin;

  if (!domain || !clientId) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
        scope: 'openid profile email'
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
