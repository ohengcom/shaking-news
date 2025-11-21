import { useState, useEffect } from "react"

export function useShaking(frequency: number, maxTiltAngle: number) {
    const [tiltAngle, setTiltAngle] = useState(-16)
    const [timeUntilNext, setTimeUntilNext] = useState(frequency)

    useEffect(() => {
        // Reset timer when frequency changes
        setTimeUntilNext(frequency)

        const tiltTimer = setInterval(() => {
            const isNegative = Math.random() < 0.5
            let randomAngle
            if (isNegative) {
                randomAngle = -maxTiltAngle + Math.random() * (maxTiltAngle - 5)
            } else {
                randomAngle = 5 + Math.random() * (maxTiltAngle - 5)
            }
            setTiltAngle(randomAngle)
            setTimeUntilNext(frequency)
        }, frequency * 1000)

        return () => clearInterval(tiltTimer)
    }, [frequency, maxTiltAngle])

    useEffect(() => {
        const countdownTimer = setInterval(() => {
            setTimeUntilNext((prev) => (prev > 0 ? prev - 1 : frequency))
        }, 1000)

        return () => clearInterval(countdownTimer)
    }, [frequency])

    return { tiltAngle, timeUntilNext }
}
