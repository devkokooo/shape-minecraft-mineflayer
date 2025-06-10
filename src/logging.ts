import chalk, { type ChalkInstance } from "chalk";

export type ServiceType = "shapes-api" | "mineflayer" | "system";
export type LogSeverity = "debug" | "info" | "warn" | "error";

const serviceColors: Record<ServiceType, ChalkInstance> = {
  "shapes-api": chalk.magenta,
  "mineflayer": chalk.green,
  "system": chalk.gray,
};

const severityBadges: Record<LogSeverity, ChalkInstance> = {
  "debug": chalk.bgWhiteBright,
  "info": chalk.bgBlack,
  "warn": chalk.bgYellowBright,
  "error": chalk.bgRedBright,
};

export default class Logger {
  static debug(message: any, service: ServiceType = "system") {
    const colorFn = serviceColors[service];
    const colorSeverity = severityBadges["debug"];
    const timestamp = new Date().toISOString();
    console.debug(`${chalk.gray(timestamp)} ${colorSeverity.bold("DEBUG")} ${colorFn(`[${service}]`)} ${chalk.whiteBright(message)}`);
  }

  static log(message: any, service: ServiceType = "system") {
    const colorFn = serviceColors[service];
    const timestamp = new Date().toISOString();
    console.log(`${chalk.gray(timestamp)} ${colorFn(`[${service}]`)} ${message}`);
  }

  static warn(message: any, service: ServiceType = "system") {
    const colorFn = serviceColors[service];
    const colorSeverity = severityBadges["warn"];
    const timestamp = new Date().toISOString();
    console.warn(`${chalk.gray(timestamp)} ${colorSeverity.bold("WARN")} ${colorFn(`[${service}]`)} ${chalk.yellowBright(message)}`);
  }

  static error(message: any, service: ServiceType = "system") {
    const colorFn = serviceColors[service];
    const colorSeverity = severityBadges["error"];
    const timestamp = new Date().toISOString();
    console.error(`${chalk.gray(timestamp)} ${colorSeverity.bold("ERROR")} ${colorFn(`[${service}]`)} ${chalk.redBright(message)}`);
  }
}
