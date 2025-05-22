import React, { cloneElement } from 'react';
import { AuthProvider } from '../useAuth';
import { ContentProvider } from '../useContent';
import { PlayerProvider } from '../usePlayer';
import { ContextProviderProps, ProviderComposerProps } from './types';

const providers = [AuthProvider, ContentProvider, PlayerProvider];

const ProviderComposer = ({ contexts, children }: ProviderComposerProps) =>
  contexts.reduce(
    (kids, Parent) =>
      cloneElement(<Parent />, {
        children: kids,
      }),
    children
  );

function ContextProvider({ children }: ContextProviderProps) {
  return <ProviderComposer contexts={providers}>{children}</ProviderComposer>;
}

export default ContextProvider;
