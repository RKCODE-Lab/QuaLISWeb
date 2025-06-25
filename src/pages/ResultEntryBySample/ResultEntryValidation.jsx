import { ResultEntry } from '../../components/Enumeration';

export function numberConversion(number, rounding) {
    return Number.parseFloat(number).toFixed(rounding);
}

export function numericGrade(parameter, sfinalresult) {
    let result = parseFloat(sfinalresult);
    let minA = parseFloat(parameter.smina);
    let maxA = parseFloat(parameter.smaxa);
    let minB = parseFloat(parameter.sminb);
    let maxB = parseFloat(parameter.smaxb);
    let minLoD = parseFloat(parameter.sminlod);
    let maxLoD = parseFloat(parameter.smaxlod);
    let minLOQ = parseFloat(parameter.sminloq);
    let maxLOQ = parseFloat(parameter.smaxloq);
    let disregard = parseFloat(parameter.sdisregard);
    if (disregard !== "null" && disregard > sfinalresult) {
        return ResultEntry.RESULTSTATUS_BELOWDISREGARD;
    }
    /* else if (!isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result >= minLOQ && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BQL;
        }
        else if (!isNaN(minLoD) && !isNaN(maxLoD)) {
            if (result >= minLoD && result <= maxLoD) {
                return ResultEntry.RESULTSTATUS_BDL;
            }
            else {
                return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, sfinalresult);
            }
        } else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, sfinalresult);
        }
    } else if (!isNaN(minLoD) && !isNaN(maxLoD)) {
        if (result >= minLoD && result <= maxLoD) {
            return ResultEntry.RESULTSTATUS_BDL;
        }
        else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, sfinalresult);
        }
    } */
    else if (!isNaN(minLoD) && !isNaN(minLOQ) && !isNaN(maxLoD) && !isNaN(maxLOQ)) {
        if (result >= minLoD && result < minLOQ) {
            return ResultEntry.RESULTSTATUS_LLOQ;
        }
        else if(result <= minLoD)
        {
            return ResultEntry.RESULTSTATUS_LLOD;
        }

        else if (result > maxLOQ && result <= maxLoD) {
            return ResultEntry.RESULTSTATUS_HLOQ;
        }
        else if(result > maxLOQ)
        {
            return ResultEntry.RESULTSTATUS_HLOD;
        }

        else {
            //return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, sfinalresult);
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
        }
    } 

    else if (!isNaN(minLoD) && !isNaN(minLOQ) && isNaN(maxLOQ) && isNaN(maxLoD)) {
        if (result >= minLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_LLOQ;
        }
        else if(result < minLoD)
        {
            return ResultEntry.RESULTSTATUS_LLOD;
        }
        else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
        }
    } 


    else if (!isNaN(minLoD) && !isNaN(minLOQ)  && !isNaN(maxLOQ) && isNaN(maxLoD))  {
        if (result >= minLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_LLOQ;
        }
        else if(result < minLoD)
        {
            return ResultEntry.RESULTSTATUS_LLOD;
        }
        else if(result > maxLOQ)
        {
            return ResultEntry.RESULTSTATUS_HLOD;
        }
        else if(result < maxLOQ && result > maxB)
        {
            return ResultEntry.RESULTSTATUS_HOOS;
        }
        else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
        }
    } 


    else if (!isNaN(minLoD) && !isNaN(minLOQ)  && !isNaN(maxLoD) && isNaN(maxLOQ) )  {
        if (result >= minLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_LLOQ;
        }
        else if(result < minLoD)
        {
            return ResultEntry.RESULTSTATUS_LLOD;
        }
        else if(result > maxLoD)
        {
            return ResultEntry.RESULTSTATUS_HLOD;
        }
        else if(result < maxLoD && result > maxB)
        {
            return ResultEntry.RESULTSTATUS_HOOS;
        }
        else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
        }
    }


    else if (!isNaN(maxLoD) && !isNaN(maxLOQ)  && isNaN(minLoD)  && isNaN (minLOQ) ) {
        if (result <= maxLoD && result >= maxLOQ) {
            return ResultEntry.RESULTSTATUS_HLOQ;
        }
        else if(result > maxLoD)
        {
            return ResultEntry.RESULTSTATUS_HLOD;
        }
        else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
        }
    } 


    else if (!isNaN(maxLoD) && !isNaN(maxLOQ)  && !isNaN(minLoD)  && isNaN (minLOQ) ) {
        if (result <= maxLoD && result >= maxLOQ) {
            return ResultEntry.RESULTSTATUS_HLOQ;
        }
        else if(result > maxLoD)
        {
            return ResultEntry.RESULTSTATUS_HLOD;
        }
        else if(result < minLoD)
        {
            return ResultEntry.RESULTSTATUS_LLOD;
        }
        else if(result < minLoD && result > maxB)
        {
            return ResultEntry.RESULTSTATUS_HOOS;
        }
        else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
        }
    }
    

    else if (!isNaN(maxLoD) && !isNaN(maxLOQ) && !isNaN(minLOQ) && isNaN(minLoD)) {
        if (result <= maxLoD && result >= maxLOQ) {
            return ResultEntry.RESULTSTATUS_HLOQ;
        }
        else if(result > maxLoD)
        {
            return ResultEntry.RESULTSTATUS_HLOD;
        }

        else if(result < minLOQ)
        {
            return ResultEntry.RESULTSTATUS_LLOQ;
        }
        else if (result > minLOQ && result < minB ) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else {
            return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
        }
    } 




    
    else {
        return findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result);
    }
}


/*export function findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result) {
    if (isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        return findGrade(minB, minA, maxA, maxB, result)
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result === minLoD) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result === maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result === minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result === maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && !isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLOQ && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && !isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else {
        return findGrade(minB, minA, maxA, maxB, result);
    }
}*/

export function findLOQandLOD(minLoD, maxLoD, minLOQ, maxLOQ, minA, maxA, minB, maxB, result) {
    if (isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        return findGrade(minB, minA, maxA, maxB, result)
    } 


    else if (!isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_LLOD  
        } else if (result === minLoD) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result > minLoD && result < minB ) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result === minB) {
            return ResultEntry.RESULTSTATUS_OOT
        } 
        else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } 


    else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLOQ) {
            return ResultEntry.RESULTSTATUS_LLOQ  
        } else if (result === minLOQ) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result > minLOQ && result < minB ) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result === minB) {
            return ResultEntry.RESULTSTATUS_OOT
        } 
        else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } 


    else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < minLOQ) {
            return ResultEntry.RESULTSTATUS_LLOQ  
        } else if (result === minLOQ) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result > minLOQ && result < minB ) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result === minB) {
            return ResultEntry.RESULTSTATUS_OOT
        } 
        else if (result > maxLOQ) {
            return ResultEntry.RESULTSTATUS_HLOQ  
        } else if (result === maxLOQ) {
            return ResultEntry.RESULTSTATUS_HOOS
        } 
        else if (result < maxLOQ && result > maxB ) {
            //return ResultEntry.RESULTSTATUS_BQL
            return ResultEntry.RESULTSTATUS_HOOS
        } 
        else if (result === maxB) {
            return ResultEntry.RESULTSTATUS_HOOT
        } 
        else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    }

    else if (isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result > maxLoD) {
            return ResultEntry.RESULTSTATUS_HLOD  
        }
        //  else if (result === maxLoD) {
        //     return ResultEntry.RESULTSTATUS_BQL
        // } 
        else if (result < maxLoD && result > maxB ) {
            //return ResultEntry.RESULTSTATUS_BQL
            return ResultEntry.RESULTSTATUS_HOOS
        } 
        // else if (result === maxB) {
        //     return ResultEntry.RESULTSTATUS_OOT
        // } 
        else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } 
    else if (!isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result > maxLoD) {
            return ResultEntry.RESULTSTATUS_HLOD  
        } else if (result === maxLoD) {
            return ResultEntry.RESULTSTATUS_HLOQ
        } 
        else if (result < maxLoD && result > maxB ) {
            //return ResultEntry.RESULTSTATUS_BQL
            return ResultEntry.RESULTSTATUS_HOOS
        } 
        else if (result === maxB) {
            return ResultEntry.RESULTSTATUS_HOOT
        } 
        else if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_LLOD  
        } else if (result === minLoD) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result > minLoD && result < minB ) {
            //return ResultEntry.RESULTSTATUS_BLOQ
            return ResultEntry.RESULTSTATUS_OOS
        } 
        else if (result === minB) {
            return ResultEntry.RESULTSTATUS_OOT
        }
        else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } 



    else if (isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result > maxLOQ) {
            return ResultEntry.RESULTSTATUS_HLOQ  
        } else if (result === maxLOQ) {
            return ResultEntry.RESULTSTATUS_HOOS
        } 
        else if (result < maxLOQ && result > maxB ) {
            //return ResultEntry.RESULTSTATUS_BQL
            return ResultEntry.RESULTSTATUS_HOOS
        } 
        else if (result === maxB) {
            return ResultEntry.RESULTSTATUS_HOOT
        } 
        else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    }


    /*else if (!isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD  
        } else if (result === minLoD) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result === minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } 
    else if (isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result > maxLoD) {
            return ResultEntry.RESULTSTATUS_BDL
        } else if (result === maxLoD) {
            return ResultEntry.RESULTSTATUS_BQL
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    }
    else if (isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result > maxLOQ) {
            return ResultEntry.RESULTSTATUS_BDL
        } else if (result === maxLOQ) {
            return ResultEntry.RESULTSTATUS_BQL
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && !isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && !isNaN(maxLoD) && isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLOQ && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && !isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= minLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && !isNaN(minLOQ) && !isNaN(maxLOQ)) {
        if (result < minLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= minLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } else if (!isNaN(minLoD) && isNaN(maxLoD) && isNaN(minLOQ) && isNaN(maxLOQ)) {
        if (result < maxLoD) {
            return ResultEntry.RESULTSTATUS_BLOD
        } else if (result >= maxLoD && result <= maxLOQ) {
            return ResultEntry.RESULTSTATUS_BLOQ
        } else {
            return findGrade(minB, minA, maxA, maxB, result);
        }
    } */else {
        return findGrade(minB, minA, maxA, maxB, result);
    }
}

export function findGrade(minB, minA, maxA, maxB, result) {
    if (isNaN(minA) && isNaN(minB) && isNaN(maxA) && isNaN(maxB)) {
		 //ALPD-4502 - when spec limits are not provided in test group
        return ResultEntry.RESULTSTATUS_PASS;
    } else if (isNaN(minA) && !isNaN(minB) && isNaN(maxA) && !isNaN(maxB)) {
        if (result >= minB && result <= maxB)
            return ResultEntry.RESULTSTATUS_PASS;
        // else if (result < minB || maxB < result)
        //     return ResultEntry.RESULTSTATUS_OOS;
        else if (result < minB)
        return ResultEntry.RESULTSTATUS_OOS;
        else if (maxB < result)
        return ResultEntry.RESULTSTATUS_HOOS;
        else
            return ResultEntry.RESULTSTATUS_PASS;
    } else if (!isNaN(minA) && isNaN(minB) && !isNaN(maxA) && isNaN(maxB)) {
        if (result >= minA && result <= maxA)
            return ResultEntry.RESULTSTATUS_PASS;
        else
            return ResultEntry.RESULTSTATUS_OOS;
    } else if (isNaN(minA) && isNaN(minB) && isNaN(maxA) && !isNaN(maxB)) {
        if (result <= maxB) {
            return ResultEntry.RESULTSTATUS_PASS;
        } else if (result > maxB) {
            // return ResultEntry.RESULTSTATUS_OOS;
            return ResultEntry.RESULTSTATUS_HOOS;
        }
    } else if (isNaN(minA) && isNaN(minB) && !isNaN(maxA) && isNaN(maxB)) {
        if (result <= maxA) {
            return ResultEntry.RESULTSTATUS_PASS;
        } else if (result > maxA) {
            // return ResultEntry.RESULTSTATUS_OOS;
            return ResultEntry.RESULTSTATUS_HOOS;
        }
    } else if (isNaN(minA) && isNaN(minB) && !isNaN(maxA) && !isNaN(maxB)) {
        if (result > maxA && result <= maxB)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result > maxB)
            // return ResultEntry.RESULTSTATUS_OOT;
            return ResultEntry.RESULTSTATUS_HOOT;
        else if (result < maxA)
            return ResultEntry.RESULTSTATUS_PASS;
    } else if (isNaN(minA) && !isNaN(minB) && isNaN(maxA) && isNaN(maxB)) {
        if (result >= minB)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result < minB)
            return ResultEntry.RESULTSTATUS_OOS;
    } else if (isNaN(minA) && !isNaN(minB) && isNaN(maxA) && !isNaN(maxB)) {
        if (result >= minA && result <= maxB)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result < minA)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result > maxB)
            // return ResultEntry.RESULTSTATUS_OOS;
            return ResultEntry.RESULTSTATUS_HOOS;
    } else if (isNaN(minA) && !isNaN(minB) && !isNaN(maxA) && !isNaN(maxB)) {
        if (result >= minB)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result > maxA && result <= maxB)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result > maxB)
            // return ResultEntry.RESULTSTATUS_OOT;
            return ResultEntry.RESULTSTATUS_HOOT;
        else if (result < minB)
            return ResultEntry.RESULTSTATUS_OOT;
    } else if (!isNaN(minA) && isNaN(minB) && isNaN(maxA) && isNaN(maxB)) {
        if (result >= minA)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result < minA)
            return ResultEntry.RESULTSTATUS_OOS;
    } else if (!isNaN(minA) && isNaN(minB) && !isNaN(maxA) && !isNaN(maxB)) {
        if (result >= minA && result <= maxA)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result >= minA && result <= maxB)
            return ResultEntry.RESULTSTATUS_OOS;
        else
            return ResultEntry.RESULTSTATUS_OOT;
    } else if (isNaN(minA) && !isNaN(minB) && !isNaN(maxA) && isNaN(maxB)) {
        if (result >= minB && result <= maxA)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result < minB)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result > maxA)
            // return ResultEntry.RESULTSTATUS_OOS;
            return ResultEntry.RESULTSTATUS_HOOS;
    } else if (isNaN(minA) && !isNaN(minB) && !isNaN(maxA) && isNaN(maxB)) {
        if (result >= minB && result <= maxA)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result > maxA && result <= maxB)
            return ResultEntry.RESULTSTATUS_OOS;
        // else if (result > maxB || result < minB)
        //     return ResultEntry.RESULTSTATUS_OOS;
        else if (result > maxB)
            return ResultEntry.RESULTSTATUS_HOOS;
        else if (result < minB)
            return ResultEntry.RESULTSTATUS_OOS;
    } else if (!isNaN(minA) && !isNaN(minB) && isNaN(maxA) && !isNaN(maxB)) {
        if (result >= minB && result < minA)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result < minB)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result >= minA)
            return ResultEntry.RESULTSTATUS_PASS;
    } else if (isNaN(minA) && !isNaN(minB) && isNaN(maxA) && !isNaN(maxB)) {
        if (result >= minB && result < minA)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result >= minA && result <= maxB)
            return ResultEntry.RESULTSTATUS_PASS;
        // else if (result > maxB || result < minB)
        //     return ResultEntry.RESULTSTATUS_OOT;
        else if (result > maxB)
        return ResultEntry.RESULTSTATUS_HOOT;
        else if (result < minB)
        return ResultEntry.RESULTSTATUS_OOT;
    } else if (!isNaN(minA) && !isNaN(minB) && !isNaN(maxA) && isNaN(maxB)) {
        if (result >= minB && result < minA)
            return ResultEntry.RESULTSTATUS_OOS;
        else if (result >= minA && result <= maxA)
            return ResultEntry.RESULTSTATUS_PASS;
        else if (result < minB)
            return ResultEntry.RESULTSTATUS_OOT;
        else if (result > maxA)
            //return ResultEntry.RESULTSTATUS_OOT;
            return ResultEntry.RESULTSTATUS_HOOT;
    } else if (!isNaN(minA) && !isNaN(minB) && !isNaN(maxA) && !isNaN(maxB)) {
        if (result >= minA && result <= maxA)
            return ResultEntry.RESULTSTATUS_PASS;
        // else if (result >= minB && result <= maxB)
        //     return ResultEntry.RESULTSTATUS_OOT;
        else if (result >= minB && result < minA)
            return ResultEntry.RESULTSTATUS_OOT;
            else if (result <= maxB && result>maxA)
            return ResultEntry.RESULTSTATUS_HOOT;
        // else if ((result < minB || maxB < result) && (minB !== 0 && maxB !== 0))
        //     return ResultEntry.RESULTSTATUS_OOS;
        else if ((result < minB) && (minB !== 0))
            return ResultEntry.RESULTSTATUS_OOS;
         else if ((maxB < result) && (maxB !== 0))
             return ResultEntry.RESULTSTATUS_HOOS;
        else
            return ResultEntry.RESULTSTATUS_PASS;
    }
}