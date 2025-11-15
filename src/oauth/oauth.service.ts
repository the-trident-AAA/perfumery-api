import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OauthService {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async getGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }

      return {
        id: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (e) {
      console.error('Error verifying Google token:', e);
      throw new UnauthorizedException('Token de Google inválido');
    }
  }
}
