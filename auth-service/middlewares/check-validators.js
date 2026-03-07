import {validationResult} from "express-validator";

export const checkValidators = (req, res, next) => { //Alt+62
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            succes: false,
            message: 'Errores de validación en la petición',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        })
    }
    next();
}