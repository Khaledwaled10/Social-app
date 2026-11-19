type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'milliseconds';

export function toMs(time: number, unit: TimeUnit): number {
    switch (unit) {
        case 'seconds':
            return time * 1000;
        case 'minutes':
            return time * 60 * 1000;
        case 'hours':
            return time * 60 * 60 * 1000;
        case 'days':
            return time * 24 * 60 * 60 * 1000;
        case 'milliseconds':
            return time;
        default:
            return time;
    }
}