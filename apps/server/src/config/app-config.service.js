"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
var common_1 = require("@nestjs/common");
var AppConfigService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppConfigService = _classThis = /** @class */ (function () {
        function AppConfigService_1(configService) {
            this.configService = configService;
        }
        Object.defineProperty(AppConfigService_1.prototype, "jwtSecret", {
            get: function () {
                var secret = this.configService.get('JWT_SECRET');
                if (!secret) {
                    throw new Error('JWT_SECRET is not defined');
                }
                return secret;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "jwtExpiresIn", {
            get: function () {
                return this.configService.get('JWT_EXPIRES_IN') || '15m';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "jwtRefreshExpiresIn", {
            get: function () {
                return this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "databaseUrl", {
            get: function () {
                var url = this.configService.get('DATABASE_URL');
                if (!url) {
                    throw new Error('DATABASE_URL is not defined');
                }
                return url;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "smtpConfig", {
            get: function () {
                return {
                    host: this.configService.get('SMTP_HOST'),
                    port: this.configService.get('SMTP_PORT'),
                    user: this.configService.get('SMTP_USER'),
                    pass: this.configService.get('SMTP_PASS'),
                };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "awsConfig", {
            get: function () {
                return {
                    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
                    region: this.configService.get('AWS_REGION'),
                    s3Bucket: this.configService.get('AWS_S3_BUCKET'),
                };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "redisUrl", {
            get: function () {
                return this.configService.get('REDIS_URL');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "openAiApiKey", {
            get: function () {
                return this.configService.get('OPENAI_API_KEY');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppConfigService_1.prototype, "port", {
            get: function () {
                return this.configService.get('PORT') || 4000;
            },
            enumerable: false,
            configurable: true
        });
        return AppConfigService_1;
    }());
    __setFunctionName(_classThis, "AppConfigService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppConfigService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppConfigService = _classThis;
}();
exports.AppConfigService = AppConfigService;
