import { StreamVideoClient } from '@stream-io/video-client';

let client = null;

/**
 * Returns a singleton instance of StreamVideoClient.
 * @param {Object} config - Configuration object for StreamVideoClient.
 * @param {string} config.apiKey - The API key for Stream.
 * @param {Object} config.user - The user object containing `id` and `name`.
 * @param {string} config.token - The authentication token for the user.
 * @returns {StreamVideoClient} - The StreamVideoClient instance.
 */
export const getStreamVideoClient = ({ apiKey, user, token }) => {
  if (!client) {
    client = new StreamVideoClient({
      apiKey,
      user,
      token,
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // Google's public STUN server
        // Remove the fake TURN server or replace with a real one if you have it
      ],
    });
  }
  return client;
};