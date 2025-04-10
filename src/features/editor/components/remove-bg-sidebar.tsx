import { cn } from "@/lib/utils"
import { type ActiveTool, type Editor } from "../types"
import { ToolSidebarHeader } from "./tool-sidebar-header"
import { ToolSidebarClose } from "./tool-sidebar-close"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type React from "react"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import Image from "next/image"
import { useRemoveBg } from "@/features/ai/use-remove-bg"

interface RemoveBgSidebarProps {
  editor: Editor | undefined
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
}

export const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  const mutation = useRemoveBg()
  const selectedObject = editor?.selectedObjects[0]

  // @ts-ignore
  const imageSrc = selectedObject?._originalElement?.currentSrc
  const onClose = () => {
    onChangeActiveTool("select")
  }

  const onClick = () => {
    mutation.mutate(
      {
        image: imageSrc,
      },
      {
        onSuccess: ({ data }) => {
          editor?.addImage(data)
        },
      }
    )
  }

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "remove-bg" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Background Removal"
        description="Remove background from image using AI"
      />
      {!imageSrc && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Feature not available for this object
          </p>
        </div>
      )}
      {imageSrc && (
        <ScrollArea>
          <div className="p-4 space-y-4">
            <div
              className={cn(
                "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                mutation.isPending && "opacity-50"
              )}
            >
              <Image src={imageSrc} fill alt="Image" className="object-cover" />
            </div>
          </div>
          <Button
            disabled={mutation.isPending}
            onClick={onClick}
            className="w-full"
          >
            Remove background
          </Button>
        </ScrollArea>
      )}

      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}
