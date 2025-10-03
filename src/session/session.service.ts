import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionService {
  /**
   * Genera un nuevo ID de sesión único
   */
  generateSessionId(): string {
    return uuidv4();
  }

  /**
   * Valida si un sessionId tiene el formato correcto
   */
  isValidSessionId(sessionId: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(sessionId);
  }
}
