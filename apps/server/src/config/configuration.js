"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    var _a, _b, _c, _d;
    return ({
        port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '4000', 10),
        databaseUrl: process.env.DATABASE_URL,
        jwt: {
            accessSecret: process.env.JWT_ACCESS_SECRET,
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            accessExpires: (_b = process.env.JWT_ACCESS_EXPIRES) !== null && _b !== void 0 ? _b : '15m',
            refreshExpires: (_c = process.env.JWT_REFRESH_EXPIRES) !== null && _c !== void 0 ? _c : '7d',
        },
        corsOrigin: ((_d = process.env.CORS_ORIGIN) !== null && _d !== void 0 ? _d : '').split(',').filter(Boolean),
    });
});
