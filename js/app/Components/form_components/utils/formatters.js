export const dateRangeFormatter = dateRange => {
    try {
        const { from, to } = dateRange
        return {
            from: new Date(from),
            to: new Date(to)
        }
    } catch (err) {
        return {
            from: new Date(),
            to: new Date()
        }
    }
}