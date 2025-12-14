const winston = require("winston");
const { format } = winston;
const { combine, timestamp, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

let loggerFlag = true;
let errorLoggerFlag = true;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
//-------------logger-------------//
const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({ filename: "var/log/registerUserLogs-%DATE%.log", datePattern: "YYYY-MM-DD", zippedArchive: true, maxsize: 10485760, maxFiles: "10d", level: "info", auditFile: false })
    ]
});

const infoLogger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({ filename: "var/log/infoLogs-%DATE%.log", datePattern: "YYYY-MM-DD", zippedArchive: true, maxsize: 10485760, maxFiles: "10d", level: "info", auditFile: false })
    ]
});

const errorLogger = winston.createLogger({
    level: "error",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({ filename: "var/log/errorLogs-%DATE%.log", datePattern: "YYYY-MM-DD", zippedArchive: true, maxsize: 10485760, maxFiles: "10d", level: "info", auditFile: false })
    ]
});

//----------logger functions----------//

exports.info_logger = async function (message) {
    if (loggerFlag) {
        infoLogger.info(`${message}`)
    }
};

exports.error_logger = async function (message) {
    if (errorLoggerFlag) {
        errorLogger.error(`${message}`)
    }
};