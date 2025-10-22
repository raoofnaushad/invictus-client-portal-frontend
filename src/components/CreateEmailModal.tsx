import { useState } from "react";
import { X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, MoreHorizontal, Table, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateEmailData } from "@/types/email";

interface CreateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmailData) => void;
}

export const CreateEmailModal = ({ isOpen, onClose, onSubmit }: CreateEmailModalProps) => {
  const [formData, setFormData] = useState<CreateEmailData>({
    from: "john@email.com",
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    body: "",
    relatedTo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      from: "john@email.com",
      to: [],
      cc: [],
      bcc: [],
      subject: "",
      body: "",
      relatedTo: ""
    });
  };

  const handleInputChange = (field: keyof CreateEmailData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Email</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                value={formData.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="Select"
                onChange={(e) => handleInputChange('to', e.target.value.split(',').map(s => s.trim()))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cc">Cc</Label>
              <Input
                id="cc"
                placeholder="Select"
                onChange={(e) => handleInputChange('cc', e.target.value.split(',').map(s => s.trim()))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bcc">Bcc</Label>
              <Input
                id="bcc"
                placeholder="Select"
                onChange={(e) => handleInputChange('bcc', e.target.value.split(',').map(s => s.trim()))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Select"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <div className="mt-1 border rounded-md">
              {/* Rich text editor toolbar */}
              <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                <Select defaultValue="times-new-roman">
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="times-new-roman">Times New Roman</SelectItem>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="11">
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                  </SelectContent>
                </Select>

                <div className="h-6 w-px bg-border mx-1" />

                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Underline className="h-4 w-4" />
                </Button>

                <div className="h-6 w-px bg-border mx-1" />

                <div className="w-6 h-6 bg-black rounded-full"></div>

                <div className="h-6 w-px bg-border mx-1" />

                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Table className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Image className="h-4 w-4" />
                </Button>

                <div className="h-6 w-px bg-border mx-1" />

                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                id="description"
                placeholder="Please enter your Description"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                className="min-h-32 border-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="relatedTo">Related To</Label>
            <Select onValueChange={(value) => handleInputChange('relatedTo', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Related To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project1">Project 1</SelectItem>
                <SelectItem value="project2">Project 2</SelectItem>
                <SelectItem value="client1">Client 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-black/90">
              Create Email
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};