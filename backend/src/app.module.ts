import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { join } from 'node:path';

import { EnvEnum } from '@enums/index';

// import { NodemailerModule } from '@modules/nodemailer/nodemailer.module';

import { isEnv } from '@utils/index';

import { DatabaseModule } from './database/database.module';
import { AllExceptionFilter } from './filter/exception.filter';
import { ThrottlerBehindProxyGuard } from './guard/throttler-behind-proxy.guard';
import { I18nModule } from './i18n/i18n.module';

import { ResponseTransformInterceptor } from './interceptors/response.transform.interceptor';
import { MonkeyModule } from '@modules/monkey/monkey.module';

const providers = [] as Provider[];
const modules = [] as DynamicModule[];

if (isEnv(EnvEnum.Production)) {
    providers.push({
        provide: APP_GUARD,
        useClass: ThrottlerBehindProxyGuard,
    });
} else {
    modules.push(
        DevtoolsModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                http: config.get<string>('NODE_ENV') !== EnvEnum.Production,
                port: config.get<number>('PORT'),
            }),
        }),
    );
}
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
        }),

        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../', '/public'),
            serveRoot: '/',
            exclude: ['/api/*', '/auth/*'],
        }),

        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                ({
                    throttlers: [
                        {
                            ttl: config.get<number>('THROTTLE_TTL'),
                            limit: config.get<number>('THROTTLE_LIMIT'),
                        },
                    ],
                    ignoreUserAgents: [
                        // Don't throttle request that have 'googlebot' defined in them.
                        // Example user agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
                        /googlebot/gi,

                        // Don't throttle request that have 'bingbot' defined in them.
                        // Example user agent: Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)
                        new RegExp('bingbot', 'gi'),
                    ],
                }) as ThrottlerModuleOptions,
        }),

        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                timeout: configService.get('HTTP_TIMEOUT'),
                maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
            }),
            inject: [ConfigService],
        }),

        I18nModule,
        DatabaseModule,
        MonkeyModule,

        ...modules,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
        ...providers,
    ],
})
export class AppModule {}
