import exp = require('express');
import * as bodyParser from 'body-parser'
import cors from 'cors';
import cookieParser = require('cookie-parser');
import { UserModuleRouteHandler } from '../../user-module/route-handler/UserModuleRouteHandler';
import { OutletModuleRouteHandler } from '../../outlet-module/route-handler/OutletModuleRouteHandler';
import { CartRouteHandler } from '../../carts-module/route-handler/CartRouteHandler';
import { ConnectModuleRouteHandler } from '../../connect-module/route-handler/ConnectModuleRouteHandler';

export class ExpressDriver{
    static app = exp()

    static build(){
       return this.buildDriver();
    }

    private static buildDriver(){
        this.app.use(bodyParser.json());
        this.app.use(cors({origin:true, credentials: true}))

        this.app.set('trust proxy', true);
        this.app.use(cookieParser());

        this.app.use(OutletModuleRouteHandler.buildRouter());
        this.app.use(CartRouteHandler.buildRouter());
        this.app.use(UserModuleRouteHandler.buildRouter());
        this.app.use(ConnectModuleRouteHandler.buildRouter());
        

        return this.app;
    }
}