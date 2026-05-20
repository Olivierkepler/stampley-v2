'use client';

import React, { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { useAudioAnalyser } from '../../hooks/useAudioAnalyser';
import IridescentOrb from './IridescentOrb';

export function StampleyVoiceAgent() {
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      setConnectionError(null);
      console.log('Connection Successful');
    },
    onDisconnect: () => console.log('Stampley is offline'),
    onMessage: (message) => console.log('User said:', message),
    onError: (err) => console.error('Error:', err),

    clientTools: {
      trigger_safety_alert: (parameters: { reason: string }) => {
        console.warn('Safety Alert Triggered:', parameters.reason);
        setShowSafetyModal(true);
        return 'Safety alert activated. Support protocols initiated.';
      },
    },
  });

  const isSessionActive = conversation.status === 'connected';

  // Only analyse mic audio when it's the user's turn to speak
  const isUserSpeaking = isSessionActive && !conversation.isSpeaking;
  const volume = useAudioAnalyser(isUserSpeaking);

  const statusLabel = conversation.isSpeaking
    ? 'Stampley is speaking…'
    : isUserSpeaking
    ? 'Listening to you…'
    : 'Ready';

  const startStampley = async () => {
    setConnectionError(null);
    setIsConnecting(true);
    try {
      const authResponse = await fetch('/api/get-signed-url', { method: 'GET' });
      const data = await authResponse.json().catch(() => ({}));

      if (!authResponse.ok) {
        const message = (data?.message ?? data?.error ?? 'Could not get voice connection.') as string;
        setConnectionError(message);
        console.error('Get signed URL failed:', authResponse.status, data);
        return;
      }

      const signedUrl = data?.signed_url ?? data?.signedUrl;
      if (!signedUrl || typeof signedUrl !== 'string') {
        const msg = 'Invalid response from server (no signed URL).';
        setConnectionError(msg);
        console.error(msg, data);
        return;
      }

      await conversation.startSession({ signedUrl });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start conversation';
      setConnectionError(message);
      console.error('Could not start conversation', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white px-6 py-12">

      {/* ── Orb + status ───────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <div className="w-64 h-64">
          <IridescentOrb />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 transition-all duration-300">
          {statusLabel}
        </p>
      </div>

      {/* ── Controls ───────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs pb-8">

        {/* Connection error */}
        {connectionError && (
          <p className="text-sm text-red-500 text-center leading-snug" role="alert">
            {connectionError}
          </p>
        )}

        {/* Primary CTA */}
        <button
          onClick={isSessionActive ? () => conversation.endSession() : startStampley}
          disabled={isConnecting}
          className={`
            w-full py-3.5 rounded-full font-semibold text-sm tracking-wide
            transition-all duration-200 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isSessionActive
              ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
            }
          `}
        >
          {isSessionActive ? 'End Check-in' : isConnecting ? 'Connecting…' : 'Start Check-in'}
        </button>

        {/* Status pill */}
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isSessionActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
            }`}
          />
          <span className="text-xs text-gray-400 capitalize">{conversation.status}</span>
        </div>
      </div>

      {/* ── Safety escalation modal ────────────────────────────────── */}
      {showSafetyModal && (
        <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-[100] p-6 text-white">
          <div className="max-w-sm w-full text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">You're not alone.</h2>
              <p className="text-red-100 text-base leading-relaxed">
                We've noticed you might be having a very tough time. Please reach out for immediate support.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="tel:6172874067"
                className="bg-white text-red-600 font-bold py-4 rounded-2xl shadow-xl text-base hover:bg-red-50 transition-colors"
              >
                Call Study Team
                <span className="block text-sm font-normal text-red-400 mt-0.5">617-287-4067</span>
              </a>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="text-red-200 hover:text-white text-sm underline underline-offset-2 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}