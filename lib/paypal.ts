import { Client, Environment } from '@paypal/paypal-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID || 'Aax7kTuGMzb7kK_X_D_zc3miLsr-_6O_2nvUfPgtH-rsAFrr8RIlRGpzaI0tMRAQ5NDul8ZJeQ2N4dBw';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'EKEB9COUxQlLdeOhsoWxC7GqhA-BHEV-8vy5y3v30aasDmVEUbU-XqwYowP-u2TVGX1IL9ZDMALwSpbL';

if (!clientId || !clientSecret) {
    console.warn('PayPal client ID and client secret not configured. Using development defaults.');
}

const environment = process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox;

export const client = new Client({
    environment,
    clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret
    }
});