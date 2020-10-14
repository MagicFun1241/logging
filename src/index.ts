import {
    blue,
    yellow,
    red,
    gray
} from 'chalk';
import nicelyFormat from 'nicely-format';
import createDebug from 'debug';

const time = () => {
    const now = new Date();
    const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return date.toISOString().replace(/.*T(.*)Z/, '$1');
};

const indentText = (text) => text.replace(/^(?!\s+$)/mg, ' '.repeat(13)).trim();

interface LoggerOptions {
    debugFunction: any;
    logFunction: any;
}

function logger(options: {
    title: string;
    messages: Array<any>;
    logFunction: any;
}) {
    const formattedMessages = options.messages.map(message => {
        if (typeof message === 'string') return message;

        return nicelyFormat(message, {
            highlight: true,
            min: true,
            theme: {
                tag: 'cyan',
                content: 'reset',
                prop: 'yellow',
                value: 'green',
                number: 'green',
                string: 'reset',
                date: 'green',
                symbol: 'red',
                regex: 'red',
                function: 'blue',
                error: 'red',
                boolean: 'yellow',
                label: 'blue',
                bracket: 'grey',
                comma: 'grey',
                misc: 'grey',
                key: 'cyan'
            }
        });
    }).map(indentText);

    options.logFunction(gray(time()), `[${options.title}]`, ...formattedMessages);
}

function createLogger(title: string, options: LoggerOptions = {
    debugFunction: createDebug(title),
    logFunction: console.log
}) {
    return {
        debug(...messages) {
            logger({
                title: yellow(`DEBUG ${title}`),
                messages,
                logFunction: options.debugFunction
            });
        },
        info(...messages) {
            logger({
                title: blue(title),
                messages,
                logFunction: options.logFunction
            });
        },
        warn(...messages) {
            logger({
                title: yellow(`WARNING ${title}`),
                messages,
                logFunction: options.logFunction
            });
        },
        error(...messages) {
            logger({
                title: red(`ERROR ${title}`),
                messages,
                logFunction: options.logFunction
            });
        },
        fatal(...messages) {
            logger({
                title: red(`========= FATAL ${title} =========`),
                messages,
                logFunction: options.logFunction
            });
        },
        trace(...messages) {
            logger({
                title: red(`TRACE ${title}`),
                messages,
                logFunction: options.logFunction
            });
        }
    };
}

export default createLogger;
