"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const rootLogger = winston_1.default.createLogger({
    level: 'silly',
    format: winston_1.default.format.simple(),
    transports: [new winston_1.default.transports.Console()],
});
const getLogger = () => {
    return rootLogger;
};
exports.getLogger = getLogger;
