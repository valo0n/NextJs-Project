import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { IncomingForm, File as FormidableFile } from "formidable";

// Duhet me caktu qe Next.js te mos e parse body-n automatikisht
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Verifiko qe useri eshte kyqur
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Pa autorizim" });
  }

  // Vetem seller dhe admin mund te ngarkojne
  if (session.user.role !== "seller" && session.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Vetëm shitësit mund të ngarkojnë imazhe" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Sigurohu qe folderi ekziston
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return new Promise<void>((resolve) => {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB max
    });

    // eslint-disable-next-line
    form.parse(req, (err: any, _fields: any, files: any) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Gabim në ngarkim", error: err.message });
        return resolve();
      }

      const file = files.image;
      if (!file) {
        res.status(400).json({ message: "Nuk u gjet file" });
        return resolve();
      }

      // Merr file-in (mund te jete array)
      const uploadedFile: FormidableFile = Array.isArray(file) ? file[0] : file;

      // Krijoj emer unik per file
      const ext = path.extname(uploadedFile.originalFilename || ".jpg");
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const newPath = path.join(uploadDir, uniqueName);

      // Zhvendos file-in me emer te ri
      fs.renameSync(uploadedFile.filepath, newPath);

      // Kthen URL publike
      const imageUrl = `/uploads/${uniqueName}`;
      res.status(200).json({ url: imageUrl });
      return resolve();
    });
  });
}
