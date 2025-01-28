import { Request, Response, NextFunction, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'


type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: function (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) {
      cb(null, join(__dirname, 
        process.env.UPLOAD_PATH_TEMP
            ? `../public/${process.env.UPLOAD_PATH_TEMP}`
            : '../public'
        ))
    },
    filename: function (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const fileSize = Number(_req.headers['content-length']);
    if (fileSize <= 2000) {
        return cb(null, false)
    }
    
    if (fileSize >= 10485760) {
        return cb(null, false)
    }

    if (!types.includes(file.mimetype)) {
        console.log('check mime');
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter });
