import { faker } from '@faker-js/faker'
import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path, { join } from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, `${faker.string.uuid()}${path.extname(file.originalname)}`);
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }
    const fileSize = Number(req.headers['content-length']);
    if (fileSize <= 2000) {
        return cb(null, false)
    }      
    if (fileSize >= 10485760) {
        return cb(null, false)
    }
    return cb(null, true)
}

export default multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, });
