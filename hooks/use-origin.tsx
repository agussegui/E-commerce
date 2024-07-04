import { useState, useEffect } from "react"


//it is used to obtain the origin URL of the application in the browser environment.
export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setMounted(true);
    }, [])

    if(!mounted) {
        return ''
    }
    return origin;
}