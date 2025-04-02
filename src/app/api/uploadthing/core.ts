import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

const auth = async (req: Request) => {
  // Placeholder authentication until Next-auth is configured
  // In a production app, replace this with proper authentication
  return { id: "temp-user-id" }
}

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req)
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Optionally save file information to your database
      return {
        uploadedBy: metadata.userId,
        url: file.url, // Use file.url from uploadthing
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
