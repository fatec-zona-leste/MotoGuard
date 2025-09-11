import { NextFunction, Request, Response } from "express";

interface validationRegextype {
    [key: string]: {
        regex: string 
        message: string 
    } 
}
const validationRegex: validationRegextype = {
    email: {
        regex: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
        message: "Email inválido",
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validate(scheme: any){
    const validation = (req: Request, res: Response, next: NextFunction) => {
        if(!req.body) return res.status(400).json({message: "Requisição inválida"});
        const { body } = req;
        const errors: Record<string, Record<string, string>> = {};

        Object.keys(scheme).forEach(item => {
            const itemSchema = scheme[item];
            

            if(itemSchema?.required && !body[item]){
                if (!errors["errors"]) errors["errors"] = {};
                errors["errors"][item] = itemSchema?.required;
                return;
            }

            // min e max de numeros
            if (typeof body[item] === "number") {
                if(itemSchema?.min !== undefined && body[item] < itemSchema.min){
                    if (!errors["errors"]) errors["errors"] = {};
                    errors["errors"][item] = `O campo deve ser no mínimo ${itemSchema.min}`;
                    return;
                }
                if(itemSchema?.max !== undefined && body[item] > itemSchema.max){
                    if (!errors["errors"]) errors["errors"] = {};
                    errors["errors"][item] = `O campo deve ser no máximo ${itemSchema.max}`;
                    return;
                }
            }
            
            // min e max de strings
            if (typeof body[item] === "string") {
                if(itemSchema?.min && body[item] && body[item].length < itemSchema?.min){
                    if (!errors["errors"]) errors["errors"] = {};
                    errors["errors"][item] = `O campo deve ter no mínimo ${itemSchema?.min} caracteres`;
                    return;
                }
                
                if(itemSchema?.max && body[item] && body[item].length > itemSchema?.max){
                    if (!errors["errors"]) errors["errors"] = {};
                    errors["errors"][item] = `O campo deve ter no máximo ${itemSchema?.max} caracteres`;
                    return;
                }
            }

            const regexItem = validationRegex[item];
            if(regexItem && (!new RegExp(regexItem.regex).test(body[item]))){
                if (!errors["errors"]) errors["errors"] = {};
                errors["errors"][item] = regexItem.message;
                return;
            }
                
        });

        if (Object.keys(errors).length > 0) return res.status(400).json(errors);
        // if(errors.length) return res.status(400).json(errors);

        return next();
    }

    return validation;
}