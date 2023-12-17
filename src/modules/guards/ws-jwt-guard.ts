import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class WsGuard implements CanActivate {
    constructor(
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient()
        const { authorization } = client.handshake.headers

        // console.log(authorization.slice(authorization.length - 3));
        return true;
    }


}