import fs from 'fs/promises'

export const deleteFileOnError = async (err, req, res, next) => {
    if (!err) return next()

    try{
        if(req.file && req.file.path){
            await fs.unlink(req.file.path)
            console.log(`Archivo eliminado debido a error: ${req.file.path}`)
        }
    }catch(unlinkErr){
        console.error(`Error al eliminar archivo: ${unlinkErr.message}`)
        return next(unlinkErr)
    }
    
    return next(err)
}