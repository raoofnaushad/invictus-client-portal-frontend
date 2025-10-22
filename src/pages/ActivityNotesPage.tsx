import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityNotesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600">Create and manage your notes</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              Notes functionality coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityNotesPage;