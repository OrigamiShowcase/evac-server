
import {ConfigModel} from "@origamicore/core";  
import { DatabaseConnection, MongoConfig } from "@origamicore/mongo";
import EnvModel from "./modules/common/models/EnvModel";
import { RedisConfig, RedisConnection } from "@origamicore/redis";
import { ConnectionEvent, ConnectionEventType, ConnectionProtocol, EndpointConfig, EndpointConnection, EndpointConnectionType, JwtConfig } from "@origamicore/endpoint";
import fs from 'fs'
import GameConfig from "./modules/game/models/GameConfig";
import AuthConfig from "./modules/auth/models/AuthConfig";
import { GoogleOauthConfig } from "@origamicore/google-auth";
let mongoContext='default';
let redisContext='default'
export default new ConfigModel({
    packageConfig:[
        new MongoConfig({
           connections:[
               new DatabaseConnection({
                   name:mongoContext,
                   database:EnvModel.databse
               })
           ]
        }),
        new RedisConfig({
           connections:new Map<string, RedisConnection>([
               [redisContext,new RedisConnection({
                   db:1
               }),] 
           ])
        }),
        
        new GoogleOauthConfig({
            redisContext,
            clientId:EnvModel.googleClientId,
            clientSecret:EnvModel.googleClientSecret,
            frontRedirectUrl:EnvModel.frontRedirect,
            redirectUrl:EnvModel.GoogleRedirect
         }), 
        new GameConfig({dbContext:mongoContext,redisContext}),
        new AuthConfig({dbContext:mongoContext,redisContext}),
        new EndpointConfig({
            connections:[
                new EndpointConnection({
                    //debug:true,
                    protocol:new ConnectionProtocol({
                        port:5000,
                        type:'http',
                        jwtConfig:new JwtConfig({
                             algorithm:'RS256',
                             secExpireTime:1000*60*60*24*1200,
                             privateKey:fs.readFileSync('security/jwtRS256.key').toString(),
                             publicKey:fs.readFileSync('security/jwtRS256.key.pub').toString(),
                        })
                    }),
                    publicFolder:['public'],
                    cors:['*'],
                    type:EndpointConnectionType.Express
                }),
                new EndpointConnection({ 
                    protocol:new ConnectionProtocol({
                        port:5001,
                        type:'http',
                        jwtConfig:new JwtConfig({
                             algorithm:'RS256',
                             secExpireTime:1000*60*60*24*1200,
                             privateKey:fs.readFileSync('security/jwtRS256.key').toString(),
                             publicKey:fs.readFileSync('security/jwtRS256.key.pub').toString(),
                        })
                    }),
                    events:[
                        new ConnectionEvent({
                            domain:'game',
                            service:'closeSession',
                            type:ConnectionEventType.Close
                        }),
                    ],
                    cors:['*'],
                    type:EndpointConnectionType.Socket
                })
            ]
         })
    ]
});