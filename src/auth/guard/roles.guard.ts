import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RolesGuard implements CanActivate {
  // Para acceder a los metadatos es necesario usar Reflector
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean {
    let entrada: boolean = true
    // Se obtienen los roles definidos en los meta datos del decorador "Roles"
    const roles: Array<String> = this.reflector.getAllAndOverride("roles", [context.getHandler(),
    context.getClass()]) // getHandler da una referencia al método del controlador de ruta de esta forma es posible identificar el metadato a extraer sobre que controlador será
    // getClass hace referencia a la clase del contexto de la llamada al guarda al igual que getHandler que hacer referencia al método del controlador de ruta
    // si el metadato de los roles está definido
    if (roles) {
      // se obtiene el rol del token
      const { user } = context.switchToHttp().getRequest()

      // si el rol del token no se encuentra dentro de los roles permitidos para esa ruta
      if (!roles.includes(user.role))
        entrada = false
    }

    const { user } = context.switchToHttp().getRequest();

    if (user.role === Role.ADMIN) return true;

    return requiredRoles.includes(user.role);
  }
}
