const IMPACT_LIMIT = 2.5;
    
export function verifyImpact(aSqrt: number): boolean {
    if (aSqrt > IMPACT_LIMIT) return true;
    return false;
}