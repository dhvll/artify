import { cn } from "@/lib/utils"
import { type ActiveTool, type Editor } from "../types"
import { ToolSidebarHeader } from "./tool-sidebar-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToolSidebarClose } from "./tool-sidebar-close"
import { useGetImages } from "@/features/images/api/use-get-images"
import { AlertTriangle, Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UploadButton } from "@/lib/unploadthing"

interface ImageSidebarProps {
  editor: Editor | undefined
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const { data, isLoading, isError } = useGetImages()
  const onClose = () => {
    onChangeActiveTool("select")
  }

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Image"
        description="Add images to your canvas"
      />
      <div className="p-4 border-b">
        <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{
            button: "Upload Image",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].url)
          }}
          onUploadError={(error: Error) => {
            console.error("Upload failed:", error)
          }}
        />
      </div>
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Failed to fetch images
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          <div className="grid grid-cols-2 gap-4">
            {data &&
              data.map((image) => {
                return (
                  <button
                    onClick={() => editor?.addImage(image.urls.regular)}
                    key={image.id}
                    className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <Image
                      fill
                      sizes="(max-width: 768px) 100px, (max-width: 1200px) 50px, 33px"
                      src={image.urls.small}
                      alt={image.alt_description || "Image"}
                      className="object-cover"
                    />
                    <Link
                      target="_blank"
                      href={image.links.html}
                      className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                    >
                      {image.user.name}
                    </Link>
                  </button>
                )
              })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}
