import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadPath = path.join(__dirname, '../../imagen');

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    cb(null, uploadPath); 
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    
    cb(null, `archivo-${timestamp}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
const router = Router();

router.post('/upload', upload.single('archivo'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se subió ningún archivo' });
    
  }
  console.log('Archivo recibido:', req.file);
  res.json({ mensaje: 'Archivo subido exitosamente', rutaArchivo: req.file.path });
});


router.get('/download/:filename', (req: Request, res: Response) => {
  const file = path.join(uploadPath, req.params.filename);
  if (fs.existsSync(file)) {
    res.download(file); 
  } else {
    res.status(404).json({ mensaje: 'Archivo no encontrado' });
  }
});

export default router;
