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
        const errors: object[] = [];

        Object.keys(scheme).forEach(item => {
            const itemSchema = scheme[item];

            if(itemSchema?.required && !body[item]){
                errors.push({[item]: itemSchema?.required});
                return;
            }
            
            if(itemSchema?.min && body[item].lenght < itemSchema?.min){
                errors.push({[item]: `O campo ${item} deve ter no mínimo ${itemSchema?.min} caracteres`});
                return;
            }
            
            if(itemSchema?.max && body[item].lenght > itemSchema?.max){
                errors.push({[item]: `O campo ${item} deve ter no máximo ${itemSchema?.max} caracteres`});
                return;
            }

            const regexItem = validationRegex[item];
            if(regexItem && (!new RegExp(regexItem.regex).test(body[item]))){
                errors.push({[item]: regexItem.message});
                return;
            }
                
        });

        if(errors.length) return res.status(400).json(errors);

        return next();
    }

    return validation;
}