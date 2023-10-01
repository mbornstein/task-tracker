export function truncDay(date: Date): Date {
    return new Date(date.toDateString())
}

export function addSecondsToDate(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000)
}

export function getOffsetSeconds(days: number, hours: number, minutes: number) {
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60
}

export function truncateToCell(date: Date): Date {
    return addSecondsToDate(
        truncDay(date),
        getOffsetSeconds(
            0,
            date.getHours(),
            Math.floor(date.getMinutes() / 10) * 10,
        ),
    )
}
