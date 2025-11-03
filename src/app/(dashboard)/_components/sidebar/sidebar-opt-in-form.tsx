import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInput } from "@/components/ui/sidebar"

export function SidebarOptInForm() {
  return (
    <Card className="gap-1 py-4 shadow-none mr-4 ml-4 mb-4 border-sidebar-border bg-sidebar-background">
      <CardHeader className="">
        <CardTitle className="text-sm">Subscribe to our newsletter</CardTitle>
        <CardDescription className="text-xs">
          Opt-in to receive updates and news about the sidebar.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <form>
          <div className="grid gap-2.5">
            <SidebarInput type="email" placeholder="Email" />
            <Button
              className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
              size="sm"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}