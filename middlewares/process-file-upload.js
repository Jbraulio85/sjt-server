export const processFileUpload = (req, res, next) => {
    if (req.file) {
        // Crear la ruta relativa con el formato: subdirectorio/archivo
        const subFolder = req.file.destination.split('/').pop(); // Extrae la última carpeta (ej: 'profiles')
        req.fileRelativePath = `${subFolder}/${req.file.filename}`;
    }
    next();
};