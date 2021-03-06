import * as process from 'process';
import {LoggerInstance} from 'blockchain-sdk';

export function initUnhandledRejection(logger: LoggerInstance) {
    process.on('unhandledRejection', (reason, p) => {
        logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
        process.exit(-1);
    });
    
    process.on('uncaughtException', (err) => {
        logger.error('uncaught exception at: ', err.stack);
        process.exit(-1);
    });    
}

export type Options = Map<string, any>;

export type Command = {command?: string, options: Options};

export function parseCommand(argv: string[]): Command|undefined {
    if (argv.length < 3) {
        console.log('no enough command');
        return ;
    }
    let command: Command = {options: new Map()};
    let start = 2;
    let firstArg = argv[2];
    if (!firstArg.startsWith('--')) {
        command.command = firstArg;
        start = 3;
    }

    let curKey: string|undefined;
    while (start < argv.length) {
        let arg = argv[start];
        if (arg.startsWith('--')) {
            // if (curKey) {
            //     command.options.set(curKey, true);
            // }
            curKey = arg.substr(2);
            command.options.set(curKey, true);
        } else {
            if (curKey) {
                command.options.set(curKey, arg);
                curKey = undefined;
            } else {
                console.error(`error command ${arg}, key must start with --`);
                return undefined;
            }
        }
        ++start;
    } 
    return command;
}