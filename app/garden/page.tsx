"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import tbService from "@/services/tb-service"


export default function GardenList() {
  const [gardens, setGardens] = useState<any[]>([])
  const [newGardenName, setNewGardenName] = useState("")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch the initi  al garden data from the server
    const fetchGardens = async () => {
        setIsLoading(true)
        try {
            const gardensData = await tbService.getInstance().getGardenList("eccdee20-26aa-11f0-870f-ad5a44cbe663");
            console.log(gardensData);
            setGardens(gardensData);
        } catch (error) {
            console.error("Error fetching gardens:", error)
        }
        setIsLoading(false)
    }

    fetchGardens()
  }, [])

  const handleAddGarden = async () => {
    if (!newGardenName.trim()) return
    const res = await tbService.getInstance().createAndGrantGardenPermission(newGardenName, "eccdee20-26aa-11f0-870f-ad5a44cbe663");
    console.log(res);
    setGardens((prevGardens) => [...prevGardens, res])
    setNewGardenName("")
    setOpen(false)
  }

  const handleDeleteGarden = async (id: number) => {
    console.log(id);
    const res = await tbService.getInstance().deleteGarden(id.toString());
    console.log(res);
    setGardens((prevGardens) => prevGardens.filter((garden) => garden.id.id != id))
  }

  if(isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold">Danh sách vườn</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Thêm vườn mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm vườn mới</DialogTitle>
              <DialogDescription>Nhập tên cho vườn mới của bạn.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên vườn
                </Label>
                <Input
                  id="name"
                  value={newGardenName}
                  onChange={(e) => setNewGardenName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button onClick={handleAddGarden} disabled={!newGardenName.trim()}>
                Thêm vườn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {gardens.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium">Chưa có vườn nào</h3>
          <p className="text-muted-foreground mt-1">Bắt đầu bằng cách thêm vườn mới</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gardens.map((garden) => (
            <Card key={garden.id.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">{garden.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteGarden(garden.id.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Xóa vườn</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">ID: {garden.id.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
