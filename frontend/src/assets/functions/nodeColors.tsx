export function getColorForErdosNumber(ErdosNumber: number): string {
    switch (ErdosNumber) {
        
        case 1:
            return "magenta";
            break;
        case 2: 
            return "red"
            break; 
        case 3: "blue";
            break; 
    
        default:
            return "grey"
    }
}